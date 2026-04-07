/**
 * fetchMarketStates.ts
 *
 * Fetches all VSMC MarketState accounts from Solana using Anchor.
 *
 * Key issues addressed:
 *  1. Buffer polyfill – `@coral-xyz/anchor` internally calls `Buffer` which
 *     does not exist in the browser unless we polyfill it.  The polyfill is
 *     applied unconditionally here so this module is safe to import anywhere.
 *  2. Explicit decoding – We use `BorshCoder.accounts.decode` with the full
 *     IDL instead of relying on the automatic type-registry lookup; this makes
 *     mismatches between the registered type name and the actual data obvious.
 *  3. Defensive runtime guards – Every access to potentially-undefined fields
 *     (e.g. `direction_parameters`) is guarded so the app never crashes with
 *     "Cannot read properties of undefined (reading 'map')".
 *  4. Diagnostic logging – Discriminator bytes and raw base-64 payload are
 *     logged at the DEBUG level so devs can verify account ownership and IDL
 *     alignment without shipping extra tooling.
 */

// ── 1. Buffer polyfill (must run before any Anchor import) ──────────────────
import { Buffer as NodeBuffer } from 'buffer'
if (typeof (globalThis as Record<string, unknown>)['Buffer'] === 'undefined') {
  ;(globalThis as Record<string, unknown>)['Buffer'] = NodeBuffer
}

import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, BorshCoder, Program } from '@coral-xyz/anchor'
import type { Idl } from '@coral-xyz/anchor'
import { VSMC_IDL } from '../idl/vsmc_idl'
import type { DirectionParameter, MarketStateAccount } from '../idl/vsmc_idl'

// ─── Public API types ────────────────────────────────────────────────────────

export interface VirtualMarketDirection {
  direction: number
  price: number
  poolAmount: number
  betCount: number
}

export interface VirtualMarket {
  pubkey: PublicKey
  name: string
  admin: PublicKey
  directions: VirtualMarketDirection[]
  totalLiquidity: number
  isActive: boolean
  createdAt: Date
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LOG_PREFIX = '[VSMC]'

/**
 * Safely converts a MarketState account (as returned by Anchor deserialization
 * or by our fallback BorshCoder path) into a VirtualMarket.
 *
 * All fields are guarded so the function never throws even when deserialization
 * returned a partial object (e.g. only `name` and `admin` populated).
 */
export function toVirtualMarket(
  pubkey: PublicKey,
  account: MarketStateAccount,
): VirtualMarket {
  // ── Diagnostic log ──────────────────────────────────────────────────────
  const hasDirectionParams = Array.isArray(account.direction_parameters)
  if (!hasDirectionParams) {
    console.warn(
      `${LOG_PREFIX} direction_parameters is ${typeof account.direction_parameters} ` +
        `for market ${pubkey.toBase58()}. ` +
        'This usually means the client IDL does not match the deployed program. ' +
        'Check that VSMC_IDL in vsmc_idl.ts has every field present in the on-chain account.',
    )
  }

  const dirParams: DirectionParameter[] = hasDirectionParams
    ? account.direction_parameters
    : []

  return {
    pubkey,
    name: account.name ?? '',
    admin: account.admin,
    directions: dirParams.map((p) => ({
      direction: p.direction ?? 0,
      price: p.price?.toNumber?.() ?? 0,
      poolAmount: p.pool_amount?.toNumber?.() ?? 0,
      betCount: p.bet_count?.toNumber?.() ?? 0,
    })),
    totalLiquidity: account.total_liquidity?.toNumber?.() ?? 0,
    isActive: account.is_active ?? false,
    createdAt: new Date(
      (account.created_at?.toNumber?.() ?? 0) * 1000,
    ),
  }
}

// ─── Main fetch function ─────────────────────────────────────────────────────

/**
 * Fetches every MarketState account owned by `programId` from the given
 * `connection` and returns them as an array of {@link VirtualMarket}.
 *
 * Decoding strategy:
 *  a) Try `program.account.marketState.all()` (Anchor high-level API).
 *  b) If that returns an empty array or throws, fall back to a manual
 *     `connection.getProgramAccounts` + `BorshCoder.accounts.decode` loop so
 *     that discriminator mismatches surface as clear error messages.
 *
 * @param connection  A `@solana/web3.js` Connection pointing at the correct cluster.
 * @param programId   The on-chain program ID for the VSMC program.
 */
export async function fetchVirtualMarketsFromChain(
  connection: Connection,
  programId: PublicKey,
): Promise<VirtualMarket[]> {
  // ── 1. Verify Buffer polyfill is in place ────────────────────────────────
  if (typeof (globalThis as Record<string, unknown>)['Buffer'] === 'undefined') {
    console.error(
      `${LOG_PREFIX} Buffer is not defined. ` +
        "Import 'buffer' and assign `globalThis.Buffer = Buffer` before calling this function.",
    )
    throw new Error('Buffer is not defined – add buffer polyfill to main.tsx')
  }

  // ── 2. Log connection info for diagnostics ───────────────────────────────
  console.info(`${LOG_PREFIX} RPC endpoint : ${connection.rpcEndpoint}`)
  console.info(`${LOG_PREFIX} Program ID   : ${programId.toBase58()}`)

  // ── 3. Build a read-only Anchor provider (Anchor 0.30 API) ───────────────
  // In Anchor ≥ 0.30 the program ID is embedded in the IDL `address` field.
  // We patch the IDL address to the caller-supplied programId so that the
  // caller can override the default value from the env var.
  const idlWithAddress: Idl = {
    ...(VSMC_IDL as Idl),
    address: programId.toBase58(),
  }

  // Dummy wallet – we only need to read accounts, not sign anything.
  const dummyWallet = {
    publicKey: PublicKey.default,
    signTransaction: <T>(tx: T) => Promise.resolve(tx),
    signAllTransactions: <T>(txs: T[]) => Promise.resolve(txs),
  }

  const provider = new AnchorProvider(connection, dummyWallet, {
    commitment: 'confirmed',
  })

  // ── 4. Instantiate the Anchor program with our full IDL ─────────────────
  const program = new Program(idlWithAddress, provider)

  // ── 5. Fetch all MarketState accounts via Anchor high-level API ──────────
  let anchorAccounts: { publicKey: PublicKey; account: MarketStateAccount }[] = []
  try {
    // NOTE: Anchor generates the camelCase accessor from the account name
    // defined in the IDL ("MarketState" → "marketState").
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await (program.account as any)['marketState'].all() as Array<{
      publicKey: PublicKey
      account: unknown
    }>
    anchorAccounts = raw as typeof anchorAccounts
    console.info(
      `${LOG_PREFIX} program.account.marketState.all() returned ${anchorAccounts.length} accounts`,
    )
  } catch (err) {
    console.warn(
      `${LOG_PREFIX} Anchor high-level fetch failed, falling back to manual decode:`,
      err,
    )
  }

  // ── 6. Fallback: manual getProgramAccounts + BorshCoder ─────────────────
  if (anchorAccounts.length === 0) {
    console.info(`${LOG_PREFIX} Attempting manual BorshCoder fallback…`)
    const coder = new BorshCoder(idlWithAddress)
    const rawAccounts = await connection.getProgramAccounts(programId)
    console.info(
      `${LOG_PREFIX} getProgramAccounts returned ${rawAccounts.length} raw accounts`,
    )

    for (const { pubkey, account: accountInfo } of rawAccounts) {
      const data = accountInfo.data
      const b64 = data.toString('base64').slice(0, 64)
      const discriminator = Array.from(data.slice(0, 8))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' ')

      console.debug(
        `${LOG_PREFIX} Account ${pubkey.toBase58()} | ` +
          `owner: ${accountInfo.owner.toBase58()} | ` +
          `data length: ${data.length} bytes | ` +
          `discriminator: ${discriminator} | ` +
          `data (base64 first 64): ${b64}`,
      )

      // Verify the account is owned by our program
      if (!accountInfo.owner.equals(programId)) {
        console.warn(
          `${LOG_PREFIX} Skipping ${pubkey.toBase58()} – owned by ` +
            `${accountInfo.owner.toBase58()}, not program ${programId.toBase58()}`,
        )
        continue
      }

      try {
        const decoded = coder.accounts.decode<MarketStateAccount>(
          'MarketState',
          data,
        )
        console.debug(
          `${LOG_PREFIX} Decoded MarketState for ${pubkey.toBase58()}:`,
          {
            name: decoded.name,
            admin: decoded.admin?.toBase58?.(),
            hasDirectionParameters: Array.isArray(decoded.direction_parameters),
            directionParametersLength: decoded.direction_parameters?.length,
            isActive: decoded.is_active,
          },
        )
        anchorAccounts.push({ publicKey: pubkey, account: decoded })
      } catch (decodeErr) {
        console.warn(
          `${LOG_PREFIX} Failed to decode account ${pubkey.toBase58()} as MarketState:`,
          decodeErr,
        )
      }
    }
  }

  // ── 7. Convert to VirtualMarket[] ────────────────────────────────────────
  return anchorAccounts.map(({ publicKey, account }) =>
    toVirtualMarket(publicKey, account),
  )
}
