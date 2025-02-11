import { createUser, user, users } from '@backend//graphql/user'
import {
  BFF_PORT,
  CORS_ORIGIN,
  TLS_CERT_PATH,
  TLS_KEY_PATH,
  USE_HTTPS,
} from '@backend/env'
import { health } from '@backend/graphql/health'
import { createTicket, ticket, tickets } from '@backend/graphql/ticket'
import { errorHandler } from '@backend/plugins/error-handler'
import { type PylonConfig, app } from '@getcronit/pylon'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
  secureHeaders(),
)

const graphql = {
  Query: {
    health,
    tickets,
    ticket,
    users,
    user,
  },
  Mutation: {
    createTicket,
    createUser,
  },
}

const config: PylonConfig = {
  plugins: [errorHandler],
}

export default {
  fetch: app.fetch,
  port: BFF_PORT,
  tls: USE_HTTPS
    ? {
        key: Bun.file(TLS_KEY_PATH),
        cert: Bun.file(TLS_CERT_PATH),
        serverName: 'localhost',
      }
    : undefined,
}

export { graphql, config }
