const APIError = require('../utils/errorAPI')

const validateUsername = (username) => {
  if (username && !/^\w+$/.test(username)) {
    throw new APIError('Username should be only letters, numbers and the underscore character.', APIError.statusCodes.BAD_REQUEST)
  }
  if (username && username.length > 50) {
    throw new APIError('Username length should be maximum 50 characters.', APIError.statusCodes.BAD_REQUEST)
  }
}

module.exports = {
  validateUsername,
}
