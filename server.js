const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const router = require('./src/routes')
const config = require('./src/config')
const errorAPI = require('./src/utils/errorAPI')
const response = require('./src/utils/response')
const passportSetup = require('./src/utils/passport')

const app = express()

passportSetup(passport)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(response.modifyResponseData)
app.use(passport.initialize())
app.use(passport.session())
app.use(config.env.endpoint, router)
app.use(errorAPI.clientErrorHandler)

app.listen(config.env.port, err => {
  if (err) throw err
  console.log(`Server is sunning on ${config.env.port} port!`)
})

process.on('unhandledRejection', (err) => {
  console.log(err);
});

module.exports = app
