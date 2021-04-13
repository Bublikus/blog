const APIError = require('../utils/errorAPI')
const { roles } = require('../utils/roles')

const permit = (resource, action) => (req, res, next) => {
  try {
    const permission = roles.can(req.user.role_id)[action](resource)

    if (!permission.granted) {
      return res.json(APIError.FORBIDDEN())
    }

    return next()
  } catch (error) {
    next(error)
  }
}

exports.permit = permit
