import type { Variables } from '@getcronit/pylon'
import { createFactory } from 'hono/factory'

type Env = {
  Variables: Variables
}

const authFactory = createFactory<Env>()

const authApp = authFactory.createApp()

export { type Env, authFactory, authApp }
