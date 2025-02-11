import {
  BFF_PORT,
  CORS_ORIGIN,
  TLS_CERT_PATH,
  TLS_KEY_PATH,
  USE_HTTPS,
} from '@backend/env'
import { app } from '@getcronit/pylon'
import { randomUUIDv7 } from 'bun'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { secureHeaders } from 'hono/secure-headers'
import { z } from 'zod'

const ticketSchema = z.object({
  ticketId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  description: z.string().optional(),
  deadline: z.date().optional(),
})
type Ticket = z.infer<typeof ticketSchema>

const store: {
  tickets: Ticket[]
} = {
  tickets: [
    {
      ticketId: 'xxxx-001',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Some Ticket 1',
      description: 'Some ticket description here.',
      deadline: new Date(),
    },
    {
      ticketId: 'xxxx-002',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Some Ticket 2',
    },
  ],
}

export const graphql = {
  Query: {
    hello: () => {
      return 'Hello, world!'
    },
    tickets: async () => {
      return store.tickets
    },
    ticket: async (id: string) => {
      const ret = store.tickets.find((t) => t.ticketId === id)
      if (!ret) {
        throw new HTTPException(404, { message: 'not found' })
      }
      return ret
    },
  },
  Mutation: {
    createTicket: async (
      title: string,
      description?: string,
      deadline?: Date,
    ) => {
      const newTicket = {
        ticketId: randomUUIDv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        title,
        description,
        deadline,
      }
      store.tickets.push(newTicket)
      return newTicket
    },
  },
}

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
  secureHeaders(),
)

// Run
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
