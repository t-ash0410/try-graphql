import { beforeAll, describe, expect, it } from 'bun:test'
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

describe('Mutation.updateTicketTitle', async () => {
  const jwt = await createJWT({
    userId: dummyUser.userId,
    now: new Date(),
  })

  let ticketId: number

  beforeAll(async () => {
    const ret = await prisma?.ticket.create({
      data: {
        title: 'Ticket1',
        description: 'Some Description',
        deadline: new Date('2025-02-14T00:00:00'),
        authorId: dummyUser.userId,
      },
    })
    ticketId = ret.ticketId
  })

  it('returns success', async () => {
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
              updateTicketTitle(
                ticketId: ${ticketId},
                title: "Updated"
              )
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "updateTicketTitle": null,
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
              updateTicketTitle(
                ticketId: ${ticketId},
                title: ""
              )
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "updateTicketTitle": null,
        },
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
              "updateTicketTitle",
            ],
          },
        ],
      }
    `)
  })
})

describe('Mutation.updateTicketDescription', async () => {
  const jwt = await createJWT({
    userId: dummyUser.userId,
    now: new Date(),
  })

  let ticketId: number

  beforeAll(async () => {
    const ret = await prisma?.ticket.create({
      data: {
        title: 'Ticket1',
        description: 'Some Description',
        deadline: new Date('2025-02-14T00:00:00'),
        authorId: dummyUser.userId,
      },
    })
    ticketId = ret.ticketId
  })

  it('returns success', async () => {
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
              updateTicketDescription(
                ticketId: ${ticketId},
                description: "Updated"
              )
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "updateTicketDescription": null,
        },
      }
    `)
  })
})

describe('Mutation.updateTicketDeadline', async () => {
  const jwt = await createJWT({
    userId: dummyUser.userId,
    now: new Date(),
  })

  let ticketId: number

  beforeAll(async () => {
    const ret = await prisma?.ticket.create({
      data: {
        title: 'Ticket1',
        description: 'Some Description',
        deadline: new Date('2025-02-14T00:00:00'),
        authorId: dummyUser.userId,
      },
    })
    ticketId = ret.ticketId
  })

  it('returns success', async () => {
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
              updateTicketDeadline(
                ticketId: ${ticketId},
                deadline: "${(new Date()).toISOString()}"
              )
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "updateTicketDeadline": null,
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
              updateTicketDeadline(
                ticketId: ${ticketId},
                deadline: "invalid"
              )
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "updateTicketDeadline": null,
        },
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
              "updateTicketDeadline",
            ],
          },
        ],
      }
    `)
  })
})

describe('Mutation.deleteTicket', async () => {
  const jwt = await createJWT({
    userId: dummyUser.userId,
    now: new Date(),
  })

  let ticketId: number

  beforeAll(async () => {
    const ret = await prisma?.ticket.create({
      data: {
        title: 'Ticket1',
        description: 'Some Description',
        deadline: new Date('2025-02-14T00:00:00'),
        authorId: dummyUser.userId,
      },
    })
    ticketId = ret.ticketId
  })

  it('returns success', async () => {
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
              deleteTicket(
                ticketId: ${ticketId}
              )
            }
          `,
        }),
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "deleteTicket": null,
        },
      }
    `)
  })
})
