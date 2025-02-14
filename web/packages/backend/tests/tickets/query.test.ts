import { beforeAll, describe, expect, it } from 'bun:test'
import { dummyUser } from '@backend-tests/fixtures'
import { JWT_KEY } from '@backend/lib/env'
import { createJWT } from '@backend/lib/jwt'
import app from '../../.pylon/index'

describe('Query.tickets', async () => {
  const jwt = await createJWT({
    userId: dummyUser.userId,
    now: new Date(),
  })

  beforeAll(async () => {
    await prisma?.ticket.createMany({
      data: [
        {
          title: 'Ticket1',
          description: 'Some Description',
          deadline: new Date('2025-02-14T00:00:00'),
          authorId: dummyUser.userId,
        },
        {
          title: 'Ticket2',
          authorId: dummyUser.userId,
        },
      ],
    })
  })

  it('returns tickets', async () => {
    const res = await app.fetch(
      new Request('https://localhost/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${JWT_KEY}=${jwt}`,
        },
        body: JSON.stringify({
          query: 'query { tickets { ticketId title description deadline } }',
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "tickets": [
            {
              "deadline": "2025-02-14T00:00:00.000Z",
              "description": "Some Description",
              "ticketId": 1,
              "title": "Ticket1",
            },
            {
              "deadline": null,
              "description": null,
              "ticketId": 2,
              "title": "Ticket2",
            },
          ],
        },
      }
    `)
  })

  it('returns a ticket by id', async () => {
    const res = await app.fetch(
      new Request('https://localhost/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${JWT_KEY}=${jwt}`,
        },
        body: JSON.stringify({
          query:
            'query { tickets(ticketId: 1) { ticketId title description deadline } }',
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "tickets": [
            {
              "deadline": "2025-02-14T00:00:00.000Z",
              "description": "Some Description",
              "ticketId": 1,
              "title": "Ticket1",
            },
          ],
        },
      }
    `)
  })
})
