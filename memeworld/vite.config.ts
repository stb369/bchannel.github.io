import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Provide `global` and `process` shims required by @coral-xyz/anchor and
  // other Node.js-first libraries when running in the browser.
  define: {
    global: 'globalThis',
    'process.env': '{}',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
