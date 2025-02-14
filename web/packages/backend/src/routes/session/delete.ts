import { DOMAIN, JWT_KEY } from '@backend/lib/env'
import { deleteCookie } from 'hono/cookie'
import type { CookieOptions } from 'hono/utils/cookie'
import { sessionFactory } from './app'

const handlers = sessionFactory.createHandlers(async (c) => {
  const opts: CookieOptions = {
    path: '/',
    secure: true,
    domain: DOMAIN,
    httpOnly: true,
    sameSite: 'Strict',
  }
  deleteCookie(c, JWT_KEY, opts)

  return c.json({})
})

export { handlers as deleteHandlers }
