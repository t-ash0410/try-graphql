import { describe, expect, it } from 'bun:test'
import { dummyUser } from '@backend/lib/fixtures'
import type { Variables } from '@getcronit/pylon'
import { Hono } from 'hono'
import { sessionRoute } from './route'

describe('GET /', () => {
  it('returns user id', async () => {
    const app = new Hono<{ Variables: Variables }>()
      .use(async (c, next) => {
        c.set('activeUser', dummyUser)
        await next()
      })
      .route('', sessionRoute)

    const res = await app.request('/')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      userId: dummyUser.userId,
    })
  })
})

describe('DELETE /', () => {
  it('returns 200 response', async () => {
    const app = new Hono().route('', sessionRoute)

    const res = await app.request('/', {
      method: 'DELETE',
    })

    expect(res.status).toBe(200)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"jwt=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict"`,
    )
  })
})
