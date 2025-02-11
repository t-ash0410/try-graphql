import { z } from 'zod'

const ticketSchema = z
  .object({
    ticketId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string(),
    description: z.string().optional(),
    deadline: z.date().optional(),
  })
  .brand('Ticket')

type Ticket = z.infer<typeof ticketSchema>

export { ticketSchema, type Ticket }
