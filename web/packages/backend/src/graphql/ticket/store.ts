import { randomUUIDv7 } from 'bun'
import { type Ticket, ticketSchema } from './schema'

export const store: {
  tickets: Ticket[]
} = {
  tickets: [
    ticketSchema.parse({
      ticketId: randomUUIDv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Some Ticket 1',
      description: 'Some ticket description here.',
      deadline: new Date(),
    }),
    ticketSchema.parse({
      ticketId: randomUUIDv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Some Ticket 2',
    }),
  ],
}
