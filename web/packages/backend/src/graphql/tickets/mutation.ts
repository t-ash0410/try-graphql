import { db } from '@backend/lib/db'
import { ServiceError, createDecorator, getContext } from '@getcronit/pylon'

const validate = createDecorator(
  async (title: string, _: string, deadline?: string) => {
    if (title.length < 1) {
      throw new ServiceError('Title cannot be empty', {
        code: 'INVALID_TITLE',
        statusCode: 400,
      })
    }
    if (deadline && Number.isNaN(new Date(deadline).getDate())) {
      throw new ServiceError('Invalid deadline', {
        code: 'INVALID_DEADLINE',
        statusCode: 400,
      })
    }
  },
)

const createTicket = validate(
  async (title: string, description?: string, deadline?: string) => {
    const ctx = getContext()

    const res = await db.ticket.create({
      data: {
        title,
        description,
        deadline,
        authorId: ctx.var.activeUser.userId,
      },
    })
    return {
      ticketId: res.ticketId,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      title: res.title,
      description: res.description,
      deadline: res.deadline,
    }
  },
)

export { createTicket }
