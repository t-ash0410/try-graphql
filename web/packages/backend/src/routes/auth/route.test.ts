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
import {
  JWT_KEY,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SSO_REDIRECT_URL,
} from '@backend/env'
import { createJWT } from '@backend/lib/jwt'
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
      `state=${state}; Path=/; Expires=Wed, 01 Jan 2020 00:10:00 GMT; HttpOnly; Secure; SameSite=Strict, ` +
        `nonce=${nonce}; Path=/; Expires=Wed, 01 Jan 2020 00:10:00 GMT; HttpOnly; Secure; SameSite=Strict`,
    )
  })
})

describe('GET /oidc/slack', async () => {
  const SLACK_SSO_URL = 'https://slack.com/api/openid.connect.token'

  const now = new Date('2020-01-01T00:00:00.000Z')

  const deleteCookie =
    'state=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict, ' +
    'nonce=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict'

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
              email: 'john-doe@stack-example.tash0410.com',
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
  })

  afterEach(() => {
    setSystemTime()

    mock.restore()
  })

  it('returns ok', async () => {
    const url = new URL('http://localhost/oidc/slack')
    url.searchParams.append('code', 'some-code')
    url.searchParams.append('state', 'some-state')

    const res = await authRoute.request(url, {
      method: 'GET',
      headers: {
        cookie: 'state=some-state; nonce=some-nonce',
      },
    })

    const jwt = await createJWT({
      userId: 1,
      now,
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchInlineSnapshot(`
      {
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU3NzgzNjgwMCwiZXhwIjoxNTc3ODQ3NjAwfQ.py11kQ-hwg944MFK5Itkcv9WqI_ID3KBwoGXigXwa-8",
      }
    `)
    expect(res.headers.get('set-cookie')).toBe(
      `${deleteCookie}, ${JWT_KEY}=${jwt}; Path=/; Expires=Wed, 01 Jan 2020 03:00:00 GMT; HttpOnly; Secure; SameSite=Strict`,
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
    expect(res.headers.get('set-cookie')).toBe(deleteCookie)
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
    expect(res.headers.get('set-cookie')).toBe(deleteCookie)
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
    expect(res.headers.get('set-cookie')).toBe(deleteCookie)
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
    expect(res.headers.get('set-cookie')).toBe(deleteCookie)
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
    expect(res.headers.get('set-cookie')).toBe(deleteCookie)
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
    expect(res.headers.get('set-cookie')).toBe(deleteCookie)
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
    expect(res.headers.get('set-cookie')).toBe(deleteCookie)
  })
})
