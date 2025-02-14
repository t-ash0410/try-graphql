import { readFileSync } from 'node:fs'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

let httpsOption:
  | {
      key: Buffer
      cert: Buffer
    }
  | undefined

try {
  httpsOption = {
    key: readFileSync(process.env.TLS_KEY_PATH || ''),
    cert: readFileSync(process.env.TLS_CERT_PATH || ''),
  }
} catch {}

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    https: httpsOption,
    proxy: {},
  },
})
