/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_SLACK_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
