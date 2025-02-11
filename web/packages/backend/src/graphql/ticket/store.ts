import type { Ticket } from './schema'

export const store: {
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
