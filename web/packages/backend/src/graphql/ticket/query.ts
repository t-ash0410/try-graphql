import { ServiceError } from '@getcronit/pylon'
import { store } from './store'

const tickets = () => {
  return store.tickets
}

const ticket = (id: string) => {
  const ret = store.tickets.find((t) => t.ticketId === id)
  if (!ret) {
    throw new ServiceError('not found', {
      code: 'NOT_FOUND',
      statusCode: 404,
    })
  }
  return ret
}

export { tickets, ticket }
