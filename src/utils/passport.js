const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const config = require('../config')
const { UserService } = require('../services')

// app.js will pass the global passport object here, and this function will configure it
module.exports = function (passport) {
  // The JWT payload is passed into the verify callback

  passport.serializeUser((user, done) => done(null, user))

  passport.deserializeUser((user, done) => done(null, user))

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.env.secret,
        ignoreExpiration: false,
        jsonWebTokenOptions: {
          maxAge: config.env.tokenExpirationPeriod,
          ignoreExpiration: false,
        },
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserService.getById(jwt_payload.sub)
          if (user) return done(null, { ...user, token: jwt_payload })
          return done(null, false)
        } catch (error) {
          return done(error, false)
        }
      }
    )
  )

}
