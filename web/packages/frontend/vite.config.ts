import { readFileSync } from 'node:fs'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    https: {
      key: readFileSync(process.env.TLS_KEY_PATH || ''),
      cert: readFileSync(process.env.TLS_CERT_PATH || ''),
    },
    proxy: {},
  },
})
