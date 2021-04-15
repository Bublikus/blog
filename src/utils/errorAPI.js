const statusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
}

class BaseError extends Error {
  constructor(name, httpCode, description, isOperational, data) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.description = description
    this.httpCode = httpCode
    this.isOperational = isOperational
    this.data = data

    Error.captureStackTrace(this)
  }
}

//free to extend the BaseError
module.exports = class APIError extends BaseError {
  constructor(
    name = 'Server error',
    httpCode = statusCodes.INTERNAL_SERVER,
    isOperational = true,
    description,
    data
  ) {
    super(name, httpCode, description, isOperational, data)
  }

  static get statusCodes() {
    return statusCodes
  }

  static OK() {
    return new APIError('Success', APIError.statusCodes.OK, ...arguments)
  }
  static BAD_REQUEST() {
    return new APIError('Bad request', APIError.statusCodes.BAD_REQUEST, ...arguments)
  }
  static UNAUTHORIZED() {
    return new APIError('Unauthorized', APIError.statusCodes.UNAUTHORIZED, ...arguments)
  }
  static FORBIDDEN() {
    return new APIError('Forbidden', APIError.statusCodes.FORBIDDEN, ...arguments)
  }
  static NOT_FOUND() {
    return new APIError('Not found', APIError.statusCodes.NOT_FOUND, ...arguments)
  }
  static INTERNAL_SERVER() {
    return new APIError('Server error', APIError.statusCodes.INTERNAL_SERVER, ...arguments)
  }

  static async clientErrorHandler(err, req, res, next) {
    try {
      if (!APIError.isTrustedError(err)) {
        res
          .status(err.status || APIError.statusCodes.BAD_REQUEST)
          .send(APIError.INTERNAL_SERVER(true, err.message, err))
      }
      res.status(err.httpCode).send(err)
    } catch (_) { next(err) }
  }
  static isTrustedError(error) {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}
