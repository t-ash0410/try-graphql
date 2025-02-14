import { describe, expect, test } from 'bun:test'
import { JWT_KEY } from '@backend/lib/env'
import { createJWT } from '@backend/lib/jwt'
import app from '../.pylon/index'

describe('tickets', async () => {
  const jwt = await createJWT({
    userId: 1,
    now: new Date(),
  })

  test('Query.posts', async () => {
    const res = await app.fetch(
      new Request('https://localhost/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${JWT_KEY}=${jwt}`,
        },
        body: JSON.stringify({
          query: 'query { tickets { ticketId title description } }',
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "tickets": [],
        },
      }
    `)
  })
})
