import { sessionApp } from './app'
import { deleteHandlers } from './delete'
import { getHandlers } from './get'

const sessionRoute = sessionApp
  .get('/', ...getHandlers)
  .delete('/', ...deleteHandlers)

export { sessionRoute }
