const { PostService } = require('../services')
const { user } = require('../config')
const { roles } = require('../utils/roles')
const APIError = require('../utils/errorAPI')

const isGranted = (role, action) => roles.can(role)[action]('post').granted

exports.create = async (req, res) => {
  const { body } = req

  if (!isGranted(req.user.role_id, 'createOwn')) {
    return res.json(APIError.FORBIDDEN())
  }

  await PostService.create(body)

  const post = await PostService.getById(id)

  return res.json(post)
}

exports.findAll = async (req, res) => {
  const { query } = req

  if (!isGranted(req.user.role_id, 'readAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  // Filter private posts from unauthorized users
  if (req.user.role_id === user.userRoles.guest) {
    query.private = 0
  }

  const data = await PostService.getAll({ query })

  return res.json(data)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const post = await PostService.getById(id)

  if (post.user_id === req.user.id && !isGranted(req.user.role_id, 'readOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (post.user_id !== req.user.id && !isGranted(req.user.role_id, 'readAny')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (req.user.id === user.userRoles.guest && post.private) {
    return res.json(APIError.FORBIDDEN())
  }

  return res.json(post)
}

exports.update = async (req, res) => {
  const { body, params: { id } } = req

  const post = await PostService.getById(id)

  if (post.user_id === req.user.id && !isGranted(req.user.role_id, 'updateOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (post.user_id !== req.user.id && !isGranted(req.user.role_id, 'updateAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  await PostService.updateById(id, body)

  const data = await PostService.getById(id)

  return res.json(data)
}

exports.delete = async (req, res) => {
  const { params: { id } } = req

  const post = await PostService.getById(id)

  if (post.user_id === req.user.id && !isGranted(req.user.role_id, 'deleteOwn')) {
    return res.json(APIError.FORBIDDEN())
  }
  if (post.user_id !== req.user.id && !isGranted(req.user.role_id, 'deleteAny')) {
    return res.json(APIError.FORBIDDEN())
  }

  await PostService.deleteById(id)

  return res.json(true)
}
