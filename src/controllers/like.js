const { LikeService } = require('../services')
const { roles } = require('../utils/roles')
const APIError = require('../utils/errorAPI')

const isGranted = (role, action) => roles.can(role)[action]('like').granted

exports.create = async (req, res) => {
  const { body } = req

  if (!isGranted(req.user.role_id, 'createOwn')) {
    return res.json(APIError.FORBIDDEN())
  }

  await LikeService.create(body)

  const like = await LikeService.getById(id)

  return res.json(like)
}

exports.findAll = async (req, res) => {
  const { query } = req

  if (!isGranted(req.user.role_id, 'readAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  const data = await LikeService.getAll({ query })

  return res.json(data)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const like = await LikeService.getById(id)

  if (like.user_id === req.user.id && !isGranted(req.user.role_id, 'readOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (like.user_id !== req.user.id && !isGranted(req.user.role_id, 'readAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  return res.json(like)
}

exports.update = async (req, res) => {
  const { body, params: { id } } = req

  const like = await LikeService.getById(id)

  if (like.user_id === req.user.id && !isGranted(req.user.role_id, 'updateOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (like.user_id !== req.user.id && !isGranted(req.user.role_id, 'updateAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  await LikeService.updateById(id, body)

  const data = await LikeService.getById(id)

  return res.json(data)
}

exports.delete = async (req, res) => {
  const { params: { id } } = req

  const like = await LikeService.getById(id)

  if (like.user_id === req.user.id && !isGranted(req.user.role_id, 'deleteOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (like.user_id !== req.user.id && !isGranted(req.user.role_id, 'deleteAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  await LikeService.deleteById(id)

  return res.json(true)
}
