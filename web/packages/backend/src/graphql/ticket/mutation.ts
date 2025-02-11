import { db } from '@backend/lib/db'

const createTicket = async (
  title: string,
  description?: string,
  deadline?: Date,
) => {
  return await db.ticket.create({
    data: {
      title,
      description,
      deadline,
      authorId: 1,
    },
  })
}

export { createTicket }
