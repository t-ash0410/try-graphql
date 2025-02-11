import { db } from '@backend/lib/db'
import { ServiceError } from '@getcronit/pylon'

const tickets = () => {
  const tickets = db.ticket.findMany()
  return tickets
}

const ticket = (id: number) => {
  const ret = db.ticket.findFirst({
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
