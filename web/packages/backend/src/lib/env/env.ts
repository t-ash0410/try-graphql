const {
  BFF_PORT,
  CORS_ORIGIN,
  DOMAIN,
  JWT_SECRET,
  JWT_KEY,

  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SSO_REDIRECT_URL,

  // develop
  USE_HTTPS,
  TLS_CERT_PATH,
  TLS_KEY_PATH,
} = process.env

const portAsNumber = BFF_PORT ? Number(BFF_PORT) : 8080
const corsOrigin = CORS_ORIGIN || 'https://localhost:5173'
const domain = DOMAIN || 'localhost'
const jwtKey = JWT_KEY || 'jwt'
const jwtSecret = JWT_SECRET || 'secret'

const slackClientId = SLACK_CLIENT_ID || ''
const slackClientSecret = SLACK_CLIENT_SECRET || ''
const slackSSORedirectUrl = SLACK_SSO_REDIRECT_URL || `${corsOrigin}/sso/slack`

const useHttps = USE_HTTPS === 'true'
const tlsCertPath = TLS_CERT_PATH || ''
const tlsKeyPath = TLS_KEY_PATH || ''

export {
  portAsNumber as BFF_PORT,
  corsOrigin as CORS_ORIGIN,
  domain as DOMAIN,
  jwtSecret as JWT_SECRET,
  jwtKey as JWT_KEY,
  slackClientId as SLACK_CLIENT_ID,
  slackClientSecret as SLACK_CLIENT_SECRET,
  slackSSORedirectUrl as SLACK_SSO_REDIRECT_URL,
  useHttps as USE_HTTPS,
  tlsCertPath as TLS_CERT_PATH,
  tlsKeyPath as TLS_KEY_PATH,
}
