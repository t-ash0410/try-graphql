import { db } from '@backend/lib/db'
import { ServiceError, createDecorator, getContext } from '@getcronit/pylon'

const validate = createDecorator(async (title: string) => {
  if (title.length < 1) {
    throw new ServiceError('Title cannot be empty', {
      code: 'INVALID_TITLE',
      statusCode: 400,
    })
  }
})

const createTicket = validate(
  async (title: string, description?: string, deadline?: Date) => {
    const ctx = getContext()

    return await db.ticket.create({
      data: {
        title,
        description,
        deadline,
        authorId: ctx.var.activeUser.userId,
      },
    })
  },
)

export { createTicket }
