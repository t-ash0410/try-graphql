import { db } from '@backend/lib/db'
import { ServiceError, createDecorator, getContext } from '@getcronit/pylon'

const validateCreate = createDecorator(
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

const createTicket = validateCreate(
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

const validateUpdateTicketTitle = createDecorator(
  async (_: number, title: string) => {
    if (title.length < 1) {
      throw new ServiceError('Title cannot be empty', {
        code: 'INVALID_TITLE',
        statusCode: 400,
      })
    }
  },
)

const updateTicketTitle = validateUpdateTicketTitle(
  async (ticketId: number, title: string) => {
    await db.ticket.update({
      data: {
        title,
      },
      where: {
        ticketId,
      },
    })
  },
)

const updateTicketDescription = async (
  ticketId: number,
  description?: string,
) => {
  await db.ticket.update({
    data: {
      description,
    },
    where: {
      ticketId,
    },
  })
}

const validateUpdateTicketDeadline = createDecorator(
  async (_: number, deadline?: string) => {
    if (deadline && Number.isNaN(new Date(deadline).getDate())) {
      throw new ServiceError('Invalid deadline', {
        code: 'INVALID_DEADLINE',
        statusCode: 400,
      })
    }
  },
)

const updateTicketDeadline = validateUpdateTicketDeadline(
  async (ticketId: number, deadline?: string) => {
    await db.ticket.update({
      data: {
        deadline,
      },
      where: {
        ticketId,
      },
    })
  },
)

const deleteTicket = async (ticketId: number) => {
  await db.ticket.delete({
    where: {
      ticketId,
    },
  })
}

export {
  createTicket,
  updateTicketTitle,
  updateTicketDescription,
  updateTicketDeadline,
  deleteTicket,
}
