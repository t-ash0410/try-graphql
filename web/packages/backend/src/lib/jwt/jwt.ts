import { DOMAIN, JWT_KEY, JWT_SECRET } from '@backend/env'
import type { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import { ResultAsync, errAsync } from 'neverthrow'

const createJWT = async (params: {
  userId: string
  now: Date
}) => {
  const iat = Math.floor(params.now.getTime() / 1000)
  const exp = iat + 3 * 60 * 60 // 3 hours
  return await sign(
    {
      sub: params.userId,
      iat,
      exp,
      iss: DOMAIN,
    },
    JWT_SECRET,
  )
}

const setJWTCookie = (params: {
  ctx: Context
  jwt: string
  now: Date
}) => {
  const expires = new Date(params.now)
  expires.setHours(params.now.getHours() + 3) // 3 hours
  setCookie(params.ctx, JWT_KEY, params.jwt, {
    path: '/',
    secure: true,
    domain: DOMAIN,
    httpOnly: true,
    expires,
    sameSite: 'Strict',
  })
}

const verifyJWTCookie = (params: {
  ctx: Context
}) => {
  const token = getCookie(params.ctx, JWT_KEY)
  if (!token) {
    return errAsync(new Error('token does not found'))
  }
  return ResultAsync.fromThrowable(() => verify(token, JWT_SECRET))()
}

export { createJWT, setJWTCookie, verifyJWTCookie }
