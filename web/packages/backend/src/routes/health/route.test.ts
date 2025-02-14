import { describe, expect, it } from 'bun:test'
import { healthRoute } from './route'

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await healthRoute.request('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toEqual('ok')
  })
})
