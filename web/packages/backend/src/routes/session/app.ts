import type { Variables } from '@getcronit/pylon'
import { createFactory } from 'hono/factory'

const sessionFactory = createFactory<{ Variables: Variables }>()

const sessionApp = sessionFactory.createApp()

export { sessionFactory, sessionApp }
