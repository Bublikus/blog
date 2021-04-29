require('dotenv').config()

module.exports = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  port: process.env.PORT,
  secret: process.env.SECRET,
  tokenExpirationPeriod: process.env.TOKEN_EXPIRATION_PERIOD,
  connectionUrl: process.env.CONNECTION_URI,
}
