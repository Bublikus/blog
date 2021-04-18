const { UserService } = require('../services')
const { user } = require('../config')
const { roles } = require('../utils/roles')
const APIError = require('../utils/errorAPI')

const isGranted = (role, action) => roles.can(role)[action]('profile').granted

exports.findAll = async (req, res) => {
  const { query } = req

  if (req.user.role_id !== user.userRoles.admin) {
    throw APIError.FORBIDDEN()
  }

  const data = await UserService.getAll({ query })

  return res.json(data)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const profile = await UserService.getById(id)

  if (!profile) {
    throw APIError.NOT_FOUND()
  }
  if (profile.id === req.user.id && !isGranted(req.user.role_id, 'readOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (profile.id !== req.user.id && !isGranted(req.user.role_id, 'readAny')) {
    throw APIError.FORBIDDEN()
  }

  delete profile.hash
  delete profile.salt
  delete profile.token

  return res.json(profile)
}

exports.getMe = async (req, res) => {
  const profile = { ...req.user }

  delete profile.hash
  delete profile.salt
  delete profile.token

  return res.json(profile)
}

exports.update = async (req, res) => {
  const { body, params: { id } } = req

  const profile = await UserService.getById(id)

  if (!profile) {
    throw APIError.NOT_FOUND()
  }
  if (profile.id === req.user.id && !isGranted(req.user.role_id, 'updateOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (profile.id !== req.user.id && !isGranted(req.user.role_id, 'updateAny')) {
    throw APIError.FORBIDDEN()
  }

  const updatedProfile = await UserService.updateById(id, body)

  return res.json(updatedProfile)
}

exports.delete = async (req, res) => {
  const { params: { id } } = req

  const profile = await UserService.getById(id)

  if (!profile) {
    throw APIError.NOT_FOUND()
  }
  if (profile.id === req.user.id && !isGranted(req.user.role_id, 'deleteOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (profile.id !== req.user.id && !isGranted(req.user.role_id, 'deleteAny')) {
    throw APIError.FORBIDDEN()
  }

  await UserService.deleteById(id)

  return res.json(true)
}
