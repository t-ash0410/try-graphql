import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  setSystemTime,
  spyOn,
} from 'bun:test'
import { db } from '@backend/lib/db'
import {
  DOMAIN,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SSO_REDIRECT_URL,
} from '@backend/lib/env'
import { dummyUser } from '@backend/lib/fixtures'
import {
  type JWTVerifyResult,
  type ResolvedKey,
  createRemoteJWKSet,
} from 'jose'
import { authRoute } from './route'

describe('GET /oidc/session', async () => {
  const now = new Date('2020-01-01T00:00:00.000Z')
  const state = crypto.randomUUID()
  const nonce = crypto.randomUUID()

  beforeEach(() => {
    setSystemTime(now)

    let callCount = 0
    spyOn(crypto, 'randomUUID').mockImplementation(() => {
      callCount++
      return callCount === 1 ? state : nonce
    })
  })

  afterEach(() => {
    setSystemTime()

    mock.restore()
  })

  it('returns ok and set cookies', async () => {
    const res = await authRoute.request('/oidc/session', {
      method: 'GET',
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      state,
      nonce,
    })
    expect(res.headers.get('set-cookie')).toBe(
      `state=${state}; Domain=${DOMAIN}; Path=/; Expires=Wed, 01 Jan 2020 00:10:00 GMT; HttpOnly; Secure; SameSite=Strict, ` +
        `nonce=${nonce}; Domain=${DOMAIN}; Path=/; Expires=Wed, 01 Jan 2020 00:10:00 GMT; HttpOnly; Secure; SameSite=Strict`,
    )
  })
})

describe('GET /oidc/slack', async () => {
  const SLACK_SSO_URL = 'https://slack.com/api/openid.connect.token'

  const now = new Date('2020-01-01T00:00:00.000Z')

  beforeAll(() => {
    authRoute.onError((_, c) => {
      return c.json({}, 500)
    })
  })

  beforeEach(() => {
    setSystemTime(now)

    mock.module('jose', () => {
      return {
        createRemoteJWKSet: createRemoteJWKSet,
        jwtVerify: () => {
          const jwt: JWTVerifyResult & ResolvedKey = {
            key: {
              type: 'some-key-type',
            },
            payload: {
              email: 'john-doe@example.com',
              name: 'John Doe',
              sub: 'UXXXXXXX',
              'https://slack.com/team_id': 'TXXXXXXX',
              access_token: 'xxxx-xxxxx.xxxx',
              picture: 'http://localhost/profile/image',
              nonce: 'some-nonce',
            },
            protectedHeader: {
              alg: '',
            },
          }
          return jwt
        },
      }
    })
    spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          id_token: 'x-xxxxxx.xxxxxx',
        }),
      ),
    )
    mock.module('@backend/lib/db', () => {
      return {
        db: {
          user: {
            findFirst: mock(() => dummyUser),
            create: mock(() => dummyUser),
          },
        },
      }
    })
  })

  afterEach(() => {
    setSystemTime()

    mock.restore()
  })

  it('returns jwt based on the found user', async () => {
    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state; nonce=some-nonce',
      },
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU3NzgzNjgwMCwiZXhwIjoxNTc3ODQ3NjAwLCJpc3MiOiJsb2NhbGhvc3QifQ.AaIJrE7EvUI0bnJ-LqE1VH5dCvC9FBKCXxLELwVv7h8",
        "slackTeamId": "TXXXXX",
      }
    `)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU3NzgzNjgwMCwiZXhwIjoxNTc3ODQ3NjAwLCJpc3MiOiJsb2NhbGhvc3QifQ.AaIJrE7EvUI0bnJ-LqE1VH5dCvC9FBKCXxLELwVv7h8; Domain=localhost; Path=/; Expires=Wed, 01 Jan 2020 03:00:00 GMT; HttpOnly; Secure; SameSite=Strict"`,
    )

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenNthCalledWith(1, SLACK_SSO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code: 'some-code',
        redirect_uri: SLACK_SSO_REDIRECT_URL,
      }),
    })

    expect(db.user.findFirst).toHaveBeenCalledTimes(1)
    expect(db.user.findFirst).toHaveBeenNthCalledWith(1, {
      where: {
        email: 'john-doe@example.com',
      },
    })

    expect(db.user.create).not.toHaveBeenCalled()
  })

  it('returns jwt based on the new user', async () => {
    mock.module('@backend/lib/db', () => {
      return {
        db: {
          user: {
            findFirst: mock(() => null), // important
            create: mock(() => dummyUser),
          },
        },
      }
    })

    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state; nonce=some-nonce',
      },
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU3NzgzNjgwMCwiZXhwIjoxNTc3ODQ3NjAwLCJpc3MiOiJsb2NhbGhvc3QifQ.AaIJrE7EvUI0bnJ-LqE1VH5dCvC9FBKCXxLELwVv7h8",
        "slackTeamId": "TXXXXX",
      }
    `)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU3NzgzNjgwMCwiZXhwIjoxNTc3ODQ3NjAwLCJpc3MiOiJsb2NhbGhvc3QifQ.AaIJrE7EvUI0bnJ-LqE1VH5dCvC9FBKCXxLELwVv7h8; Domain=localhost; Path=/; Expires=Wed, 01 Jan 2020 03:00:00 GMT; HttpOnly; Secure; SameSite=Strict"`,
    )

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenNthCalledWith(1, SLACK_SSO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code: 'some-code',
        redirect_uri: SLACK_SSO_REDIRECT_URL,
      }),
    })

    expect(db.user.findFirst).toHaveBeenCalledTimes(1)
    expect(db.user.findFirst).toHaveBeenNthCalledWith(1, {
      where: {
        email: 'john-doe@example.com',
      },
    })

    expect(db.user.create).toHaveBeenCalledTimes(1)
    expect(db.user.create).toHaveBeenNthCalledWith(1, {
      data: {
        email: 'john-doe@example.com',
        name: 'John Doe',
        slackUserId: 'UXXXXXXX',
        slackTeamId: 'TXXXXXXX',
      },
    })
  })

  it('returns 500 if state is not set in cookie', async () => {
    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'nonce=some-nonce;', // important
      },
    })

    expect(res.status).toBe(500)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict"`,
    )
  })

  it('returns 500 if state is not match', async () => {
    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'invalid-state') // important

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state; nonce=some-nonce',
      },
    })

    expect(res.status).toBe(500)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict"`,
    )
  })

  it('returns 500 if request to slack api fails', async () => {
    spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error('some error') // important
    })

    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state; nonce=some-nonce',
      },
    })

    expect(res.status).toBe(500)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict"`,
    )
  })

  it('returns 500 if the response schema from the slack api is not ok', async () => {
    spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: false, // important
          error: 'some error',
        }),
      ),
    )

    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state; nonce=some-nonce',
      },
    })

    expect(res.status).toBe(500)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict"`,
    )
  })

  it('returns 500 if the response schema from the slack api is not expected', async () => {
    spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          invalidSchema: '', // important
        }),
      ),
    )

    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state; nonce=some-nonce',
      },
    })

    expect(res.status).toBe(500)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict"`,
    )
  })

  it('returns 500 if nonce is not set in cookie', async () => {
    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state', // important
      },
    })

    expect(res.status).toBe(500)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict"`,
    )
  })

  it('returns 500 if nonce is not match', async () => {
    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state; nonce=invalid-nonce', // important
      },
    })

    expect(res.status).toBe(500)
    expect(res.headers.get('set-cookie')).toMatchInlineSnapshot(
      `"state=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict, nonce=; Max-Age=0; Domain=localhost; Path=/; HttpOnly; Secure; SameSite=Strict"`,
    )
  })
})
