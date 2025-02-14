import { sessionFactory } from './app'

const handlers = sessionFactory.createHandlers(async (c) => {
  const { userId } = c.var.activeUser
  return c.json({
    userId,
  })
})

export { handlers as getHandlers }
