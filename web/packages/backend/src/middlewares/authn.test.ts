import { describe, expect, it } from 'bun:test'
import { JWT_KEY } from '@backend/lib/env'
import { createJWT } from '@backend/lib/jwt'
import type { Variables } from '@getcronit/pylon'
import { Hono } from 'hono'
import { authN } from './authn'

describe('authN', () => {
  it('sets the component in context', async () => {
    const app = new Hono<{ Variables: Variables }>()
      .use(authN)
      .get('/', (c) => {
        expect(c.var.activeUser).toBeTruthy()
        return c.text('ok!')
      })

    const jwt = await createJWT({
      userId: 1,
      now: new Date(),
    })
    const res = await app.request('/', {
      headers: {
        Cookie: `${JWT_KEY}=${jwt}`,
      },
    })
    expect(res.status).toBe(200)
  })

  it('returns 401 error when an unauthorized access is accepted', async () => {
    const app = new Hono<{ Variables: Variables }>()
      .use(authN)
      .get('/', (c) => {
        return c.text('ok!')
      })
    const res = await app.request('/')
    expect(res.status).toBe(401)
  })
})
