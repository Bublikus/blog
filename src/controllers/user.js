const { UserService } = require('../services')
const { roles } = require('../utils/roles')
const APIError = require('../utils/errorAPI')

const isGranted = (role, action) => roles.can(role)[action]('profile').granted

exports.create = async (req, res) => {
  const { body } = req

  if (!isGranted(req.user.role_id, 'createOwn')) {
    return res.json(APIError.FORBIDDEN())
  }

  await UserService.create(body)

  const profile = await UserService.getById(id)

  return res.json(profile)
}

exports.findAll = async (req, res) => {
  const { query } = req

  if (!isGranted(req.user.role_id, 'readAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  const data = await UserService.getAll({ query })

  return res.json(data)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const profile = await UserService.getById(id)

  if (profile.user_id === req.user.id && !isGranted(req.user.role_id, 'readOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (profile.user_id !== req.user.id && !isGranted(req.user.role_id, 'readAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  delete profile.hash
  delete profile.salt
  delete profile.token

  return res.json(profile)
}

exports.getMe = async (req, res) => {
  const user = { ...req.user }

  delete user.hash
  delete user.salt
  delete user.token

  return res.json(user)
}

exports.update = async (req, res) => {
  const { body, params: { id } } = req

  const profile = await UserService.getById(id)

  if (profile.user_id === req.user.id && !isGranted(req.user.role_id, 'updateOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (profile.user_id !== req.user.id && !isGranted(req.user.role_id, 'updateAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  await UserService.updateById(id, body)

  const data = await UserService.getById(id)

  return res.json(data)
}

exports.delete = async (req, res) => {
  const { params: { id } } = req

  const profile = await UserService.getById(id)

  if (profile.user_id === req.user.id && !isGranted(req.user.role_id, 'deleteOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (profile.user_id !== req.user.id && !isGranted(req.user.role_id, 'deleteAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  await UserService.deleteById(id)

  return res.json(true)
}
