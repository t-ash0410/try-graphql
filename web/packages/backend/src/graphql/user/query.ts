import { db } from '@backend/lib/db'
import { ServiceError } from '@getcronit/pylon'

const users = async () => {
  return await db.ticket.findMany()
}

const user = async (id: number) => {
  const ret = await db.user.findFirst({
    where: {
      userId: id,
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

export { users, user }
