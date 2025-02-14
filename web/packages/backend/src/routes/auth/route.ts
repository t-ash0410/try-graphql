import { authApp } from './app'
import { sessionHandlers } from './session'
import { slackHandlers } from './slack'

const authRoute = authApp
  .get('/oidc/slack', ...slackHandlers)
  .get('/oidc/session', ...sessionHandlers)

export { authRoute }
