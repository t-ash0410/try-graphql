import { verifyJWTCookie } from '@backend/lib/jwt'
import type { Variables } from '@getcronit/pylon'
import { createMiddleware } from 'hono/factory'

export const authN = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const token = await verifyJWTCookie({ ctx: c })
    if (token.isErr()) {
      return c.json({}, 401)
    }
    c.set('activeUser', {
      userId: token.value.sub as number,
    })

    await next()
  },
)
