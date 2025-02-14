import { db } from '@backend/lib/db'
import { getContext } from '@getcronit/pylon'

const createTicket = async (
  title: string,
  description?: string,
  deadline?: Date,
) => {
  const ctx = getContext()

  return await db.ticket.create({
    data: {
      title,
      description,
      deadline,
      authorId: ctx.var.activeUser.userId,
    },
  })
}

export { createTicket }
