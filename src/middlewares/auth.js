const passport = require('passport')
const APIError = require('../utils/errorAPI')
const { user: { userRoles } } = require('../config')
const { ExpiredTokenService } = require('../services')

const authorize = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err) {
      return next(err)
    }
    // if (err || !user) {
    //   return res.json(APIError.UNAUTHORIZED())
    // }

    const token = req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null
    const isExpired = token ? await ExpiredTokenService.getByToken(token) : true

    if (user && isExpired) {
      res.json(new APIError('Token expired!', APIError.statusCodes.UNAUTHORIZED))
    }

    req.token = token
    req.user = user || { role_id: userRoles.guest }

    return next()
  })(req, res, next)
}

exports.authorize = authorize
