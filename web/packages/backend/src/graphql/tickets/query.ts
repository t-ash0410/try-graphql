import { db } from '@backend/lib/db'
import { ServiceError, getContext } from '@getcronit/pylon'

const tickets = async () => {
  const ctx = getContext()

  return await db.ticket.findMany({
    where: {
      authorId: ctx.var.activeUser.userId,
    },
  })
}

const ticket = async (id: number) => {
  const ctx = getContext()

  const ret = await db.ticket.findFirst({
    where: {
      authorId: ctx.var.activeUser.userId,
      ticketId: id,
    },
  })
  if (!ret) {
    throw new ServiceError('not found', {
      code: 'NOT_FOUND',
      statusCode: 404,
    })
  }
  return ret
}

export { tickets, ticket }
