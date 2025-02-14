import { createTicket, tickets } from '@backend/graphql'
import {
  BFF_PORT,
  CORS_ORIGIN,
  TLS_CERT_PATH,
  TLS_KEY_PATH,
  USE_HTTPS,
} from '@backend/lib/env'
import { authN } from '@backend/middlewares'
import { errorHandler } from '@backend/plugins'
import { authRoute, healthRoute } from '@backend/routes'
import { type PylonConfig, app } from '@getcronit/pylon'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

const customApp = app
  .use(
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    }),
    secureHeaders(),
  )
  .use('/graphql', authN)
  .route('/health', healthRoute)
  .route('/auth', authRoute)

const graphql = {
  Query: {
    tickets,
  },
  Mutation: {
    createTicket,
  },
}

const config: PylonConfig = {
  plugins: [errorHandler],
}

export default {
  fetch: customApp.fetch,
  port: BFF_PORT,
  tls: USE_HTTPS
    ? {
        key: Bun.file(TLS_KEY_PATH),
        cert: Bun.file(TLS_CERT_PATH),
        serverName: 'localhost',
      }
    : undefined,
}

export type App = typeof customApp

export { graphql, config }
