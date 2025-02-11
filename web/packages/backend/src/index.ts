import {
  BFF_PORT,
  CORS_ORIGIN,
  TLS_CERT_PATH,
  TLS_KEY_PATH,
  USE_HTTPS,
} from '@backend/env'
import { app } from '@getcronit/pylon'
import { cors } from 'hono/cors'
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

export const graphql = {
  Query: {
    hello: () => {
      return 'Hello, world!'
    },
    tickets: async (): Promise<Ticket[]> => [
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
    ticket: async (id: string): Promise<Ticket> => ({
      ticketId: 'xxxx',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Some Ticket',
      description: 'Some ticket description here.',
      deadline: new Date(),
    }),
  },
  Mutation: {
    createTicket: async (
      title: string,
      description?: string,
      deadline?: Date,
    ): Promise<Ticket> => ({
      ticketId: 'xxxx',
      createdAt: new Date(),
      updatedAt: new Date(),
      title,
      description,
      deadline,
    }),
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
