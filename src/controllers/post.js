const { PostService } = require('../services')
const { user } = require('../config')
const { roles } = require('../utils/roles')
const APIError = require('../utils/errorAPI')

const isGranted = (role, action) => roles.can(role)[action]('post').granted

exports.create = async (req, res) => {
  const { body } = req

  if (!isGranted(req.user.role_id, 'createOwn')) {
    throw APIError.FORBIDDEN()
  }

  body.user_id = req.user.id
  const post = await PostService.create(body)

  console.log(post)

  return res.json(post)
}

exports.findAll = async (req, res) => {
  const { query } = req

  if (!isGranted(req.user.role_id, 'readAny')) {
    throw APIError.FORBIDDEN()
  }

  // Filter private posts from unauthorized users
  if (req.user.role_id === user.userRoles.guest) {
    query.private = false
  }

  const post = await PostService.getAll({ query })

  return res.json(post)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const post = await PostService.getById(id)

  if (!post) {
    throw APIError.NOT_FOUND()
  }
  if (post.user_id === req.user.id && !isGranted(req.user.role_id, 'readOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (post.user_id !== req.user.id && !isGranted(req.user.role_id, 'readAny')) {
    throw APIError.FORBIDDEN()
  }
  if (req.user.role_id === user.userRoles.guest && post.private) {
    throw APIError.FORBIDDEN()
  }

  return res.json(post)
}

exports.update = async (req, res) => {
  const { body, params: { id } } = req

  const post = await PostService.getById(id)

  if (!post) {
    throw APIError.NOT_FOUND()
  }
  if (post.user_id === req.user.id && !isGranted(req.user.role_id, 'updateOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (post.user_id !== req.user.id && !isGranted(req.user.role_id, 'updateAny')) {
    throw APIError.FORBIDDEN()
  }

  const updatedPost = await PostService.updateById(id, body)
  updatedPost.user_id = req.user.id

  return res.json(updatedPost)
}

exports.delete = async (req, res) => {
  const { params: { id } } = req

  const post = await PostService.getById(id)

  if (!post) {
    throw APIError.NOT_FOUND()
  }
  if (post.user_id === req.user.id && !isGranted(req.user.role_id, 'deleteOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (post.user_id !== req.user.id && !isGranted(req.user.role_id, 'deleteAny')) {
    throw APIError.FORBIDDEN()
  }

  await PostService.deleteById(id)

  return res.json(true)
}
