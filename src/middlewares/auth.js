const passport = require('passport')
const APIError = require('../utils/errorAPI')
const errorHandler = require('../utils/errorHandler')
const { user: { userRoles } } = require('../config')

const authorize = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err) {
      return next(err)
    }

    try {
      const token = req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null
      const isExpired = user.token ? user.token.exp < Date.now() / 1000 : true

      if (user && isExpired) {
        throw new APIError('Token expired!', APIError.statusCodes.UNAUTHORIZED)
      }

      req.token = token
      req.user = user || { role_id: userRoles.guest }

      return next()
    } catch (e) {
      next(e)
    }
  })(req, res, next)
}

exports.authorize = errorHandler(authorize)
