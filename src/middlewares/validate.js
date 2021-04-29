const APIError = require('../utils/errorAPI')
const { validationError } = require('../normalizers')
const propertyAccessor = require('../utils/propertyAccessor')

module.exports = function (schema, source = 'body') {
  return async function (req) {
    try {
      const data = await schema.validateAsync(propertyAccessor.get(req, source), {
        abortEarly: false
      })

      propertyAccessor.set(req, source, data)
    } catch (e) {
      throw APIError.BAD_REQUEST(true, 'Unprocessable Entity', validationError.normalize(e))
    }
  }
}
