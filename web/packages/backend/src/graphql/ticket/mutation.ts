import { randomUUIDv7 } from 'bun'
import { ticketSchema } from './schema'
import { store } from './store'

const createTicket = (title: string, description?: string, deadline?: Date) => {
  const newTicket = ticketSchema.parse({
    ticketId: randomUUIDv7(),
    createdAt: new Date(),
    updatedAt: new Date(),
    title,
    description,
    deadline,
  })
  store.tickets.push(newTicket)
  return newTicket
}

export { createTicket }
