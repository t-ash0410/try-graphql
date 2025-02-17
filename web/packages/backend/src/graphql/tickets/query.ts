import { db } from '@backend/lib/db'
import { getContext } from '@getcronit/pylon'

const tickets = async (ticketId?: number) => {
  const ctx = getContext()

  const res = await db.ticket.findMany({
    where: {
      authorId: ctx.var.activeUser.userId,
      ticketId,
    },
  })
  return res.map((ticket) => ({
    ticketId: ticket.ticketId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    title: ticket.title,
    description: ticket.description,
    deadline: ticket.deadline,
  }))
}

export { tickets }
