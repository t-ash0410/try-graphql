import { db } from '@backend/lib/db'
import { ServiceError } from '@getcronit/pylon'

const tickets = async () => {
  return await db.ticket.findMany()
}

const ticket = async (id: number) => {
  const ret = await db.ticket.findFirst({
    where: {
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
