import { DOMAIN } from '@backend/lib/env'
import { setCookie } from 'hono/cookie'
import type { CookieOptions } from 'hono/utils/cookie'
import { authFactory } from './app'

const handlers = authFactory.createHandlers(async (c) => {
  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + 10)

  const opts: CookieOptions = {
    path: '/',
    secure: true,
    domain: DOMAIN,
    httpOnly: true,
    expires,
    sameSite: 'Strict',
  }

  const state = crypto.randomUUID()
  setCookie(c, 'state', state, opts)

  const nonce = crypto.randomUUID()
  setCookie(c, 'nonce', nonce, opts)

  return c.json({
    state,
    nonce,
  })
})

export { handlers as sessionHandlers }
