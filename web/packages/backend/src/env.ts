const {
  BFF_PORT,
  CORS_ORIGIN,
  DOMAIN,
  JWT_SECRET,
  JWT_KEY,

  // develop
  USE_HTTPS,
  TLS_CERT_PATH,
  TLS_KEY_PATH,
} = process.env

const portAsNumber = BFF_PORT ? Number(BFF_PORT) : 8080
const corsOrigin = CORS_ORIGIN || 'https://localhost:3000'
const jwtKey = JWT_KEY || 'jwt'
const jwtSecret = JWT_SECRET || 'secret'

const useHttps = USE_HTTPS === 'true'
const tlsCertPath = TLS_CERT_PATH || ''
const tlsKeyPath = TLS_KEY_PATH || ''

export {
  portAsNumber as BFF_PORT,
  corsOrigin as CORS_ORIGIN,
  DOMAIN,
  jwtSecret as JWT_SECRET,
  jwtKey as JWT_KEY,
  useHttps as USE_HTTPS,
  tlsCertPath as TLS_CERT_PATH,
  tlsKeyPath as TLS_KEY_PATH,
}
