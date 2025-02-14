import type { App } from '@try-graphql/backend'
import { type ClientRequestOptions, hc } from 'hono/client'

export const getHC = (options?: ClientRequestOptions) => {
  return hc<App>(import.meta.env.VITE_BACKEND_URL, {
    init: {
      credentials: 'include',
    },
    ...options,
  })
}
