import { type Context, Hono } from 'hono'

const healthRoute = new Hono().get('/', (c: Context) => {
  return c.text('ok')
})

export { healthRoute }
