import { describe, expect, it } from 'bun:test'
import { dummyUser } from '@backend-tests/fixtures'
import { JWT_KEY } from '@backend/lib/env'
import { createJWT } from '@backend/lib/jwt'
import app from '../../.pylon/index'

describe('Mutation.createTicket', async () => {
  const jwt = await createJWT({
    userId: dummyUser.userId,
    now: new Date(),
  })

  it('returns a new ticket', async () => {
    const res = await app.fetch(
      new Request('https://localhost/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${JWT_KEY}=${jwt}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              createTicket(
                title: "New Ticket",
                description: "This is a new ticket",
                deadline: "2025-02-14T00:00:00+09:00"
              ) {
                ticketId
                title
                description
                deadline
              }
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "createTicket": {
            "deadline": "2025-02-13T15:00:00.000Z",
            "description": "This is a new ticket",
            "ticketId": 3,
            "title": "New Ticket",
          },
        },
      }
    `)
  })

  it('returns an error when title is empty', async () => {
    const res = await app.fetch(
      new Request('https://localhost/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${JWT_KEY}=${jwt}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              createTicket(
                title: ""
              ) {
                ticketId
                title
                description
                deadline
              }
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": null,
        "errors": [
          {
            "extensions": {
              "code": "INVALID_TITLE",
              "statusCode": 400,
            },
            "locations": [
              {
                "column": 15,
                "line": 3,
              },
            ],
            "message": "Title cannot be empty",
            "path": [
              "createTicket",
            ],
          },
        ],
      }
    `)
  })

  it('returns an error when deadline is not datetime', async () => {
    const res = await app.fetch(
      new Request('https://localhost/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${JWT_KEY}=${jwt}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              createTicket(
                title: "test",
                deadline: "invalid"
              ) {
                ticketId
                title
                description
                deadline
              }
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": null,
        "errors": [
          {
            "extensions": {
              "code": "INVALID_DEADLINE",
              "statusCode": 400,
            },
            "locations": [
              {
                "column": 15,
                "line": 3,
              },
            ],
            "message": "Invalid deadline",
            "path": [
              "createTicket",
            ],
          },
        ],
      }
    `)
  })
})
