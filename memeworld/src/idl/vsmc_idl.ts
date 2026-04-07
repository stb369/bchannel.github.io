import type { Idl } from '@coral-xyz/anchor'
import type BN from 'bn.js'
import type { PublicKey } from '@solana/web3.js'

// ─── TypeScript types for MarketState account fields ───────────────────────

/** A single directional-bet parameter stored inside MarketState */
export interface DirectionParameter {
  /** 0 = UP / BUY, 1 = DOWN / SELL */
  direction: number
  /** Current price for this direction (lamports or token units) */
  price: BN
  /** Total pooled liquidity for this direction */
  pool_amount: BN
  /** Number of open bets in this direction */
  bet_count: BN
}

/** Raw account data as returned by Anchor deserialization */
export interface MarketStateAccount {
  name: string
  admin: PublicKey
  direction_parameters: DirectionParameter[]
  bump: number
  total_liquidity: BN
  is_active: boolean
  created_at: BN
}

// ─── Anchor 0.30 IDL definition (must match deployed program exactly) ────────
//
// Replace VSMC_PROGRAM_ADDRESS with the real on-chain program ID.
// The discriminators below are sha256("account:<Name>")[0..8] – Anchor computes
// them automatically but they must be present in the IDL for the new spec.
//
// NOTE: In Anchor ≥ 0.30 the IDL format changed significantly:
//   - `address`  holds the program public key
//   - `metadata` holds name/version/spec
//   - `accounts` only holds name + discriminator; struct fields live in `types`
//   - pubkey fields use the literal string "pubkey" (not "publicKey")
//   - defined-type references use { defined: { name: "TypeName" } }
export const VSMC_PROGRAM_ADDRESS =
  (import.meta.env.VITE_VSMC_PROGRAM_ID as string | undefined) ??
  '11111111111111111111111111111111'

export const VSMC_IDL = {
  address: VSMC_PROGRAM_ADDRESS,
  metadata: {
    name: 'vsmc_program',
    version: '0.1.0',
    spec: '0.1.0',
    description: 'Virtual Smart Market Contract',
  },
  instructions: [],
  accounts: [
    {
      name: 'MarketState',
      // sha256("account:MarketState")[0..8]
      discriminator: [0, 125, 123, 215, 95, 96, 164, 194],
    },
  ],
  types: [
    {
      name: 'MarketState',
      type: {
        kind: 'struct' as const,
        fields: [
          { name: 'name', type: 'string' as const },
          { name: 'admin', type: 'pubkey' as const },
          {
            name: 'direction_parameters',
            type: { vec: { defined: { name: 'DirectionParameter' } } },
          },
          { name: 'bump', type: 'u8' as const },
          { name: 'total_liquidity', type: 'u64' as const },
          { name: 'is_active', type: 'bool' as const },
          { name: 'created_at', type: 'i64' as const },
        ],
      },
    },
    {
      name: 'DirectionParameter',
      type: {
        kind: 'struct' as const,
        fields: [
          { name: 'direction', type: 'u8' as const },
          { name: 'price', type: 'u64' as const },
          { name: 'pool_amount', type: 'u64' as const },
          { name: 'bet_count', type: 'u64' as const },
        ],
      },
    },
  ],
  errors: [],
} satisfies Idl

