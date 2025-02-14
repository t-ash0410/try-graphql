import { db } from '@backend/lib/db'
import { getContext } from '@getcronit/pylon'

const tickets = async (ticketId?: number) => {
  const ctx = getContext()

  return await db.ticket.findMany({
    where: {
      authorId: ctx.var.activeUser.userId,
      ticketId,
    },
  })
}

export { tickets }
