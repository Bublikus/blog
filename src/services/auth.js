const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const config = require('../config')
const validate = require('../middlewares/validate')
const APIError = require('../utils/errorAPI')
const { userSchema } = require('../schemas')
const UserService = require('./user')

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

/**
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === hashVerify
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the DB user ID
 */
function issueJWT(user) {
  const { id } = user

  const expiresIn = config.env.tokenExpirationPeriod

  const payload = {
    sub: id,
    iat: Math.floor(Date.now() / 1000),
  }

  const signedToken = jsonwebtoken.sign(payload, config.env.secret, { expiresIn })

  return {
    token: 'Bearer ' + signedToken,
    expiresIn,
  }
}

exports.login = async (user) => {
  const { username, password } = user

  const dbUser = await UserService.getByName(username)

  if (!dbUser) {
    throw new APIError('User in not registered', APIError.statusCodes.UNAUTHORIZED)
  }

  const isValid = validPassword(password, dbUser.hash, dbUser.salt)

  if (!isValid) {
    throw new APIError('Wrong password!', APIError.statusCodes.BAD_REQUEST)
  }

  const { token, expiresIn } = issueJWT(dbUser)

  const formattedUser = { ...dbUser }

  delete formattedUser.hash
  delete formattedUser.salt

  return {
    token,
    expiresIn,
    data: formattedUser,
  }
}

exports.register = async (user) => {
  const { username, password } = user

  await validate(userSchema.update)({ body: user })

  const { salt, hash } = genPassword(password)

  const existingUser = await UserService.getByName(username)
  if (existingUser) throw new Error('User already registered')

  const userObj = await UserService.create({
    username,
    role_id: config.user.userRoles.user,
    hash,
    salt,
  })

  delete userObj.hash
  delete userObj.salt

  return userObj
}
