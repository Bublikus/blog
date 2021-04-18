const { CommentService } = require('../services')
const { roles } = require('../utils/roles')
const APIError = require('../utils/errorAPI')

const isGranted = (role, action) => roles.can(role)[action]('comment').granted

exports.create = async (req, res) => {
  const { body } = req

  if (!isGranted(req.user.role_id, 'createOwn')) {
    throw APIError.FORBIDDEN()
  }

  body.user_id = req.user.id
  const comment = await CommentService.create(body)

  return res.json(comment)
}

exports.findAll = async (req, res) => {
  const { query } = req

  if (!isGranted(req.user.role_id, 'readAny')) {
    throw APIError.FORBIDDEN()
  }

  const data = await CommentService.getAll({ query })

  return res.json(data)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const comment = await CommentService.getById(id)

  if (!comment) {
    throw APIError.NOT_FOUND()
  }
  if (comment.user_id === req.user.id && !isGranted(req.user.role_id, 'readOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (comment.user_id !== req.user.id && !isGranted(req.user.role_id, 'readAny')) {
    throw APIError.FORBIDDEN()
  }

  return res.json(comment)
}

exports.update = async (req, res) => {
  const { body, params: { id } } = req

  const comment = await CommentService.getById(id)

  if (!comment) {
    throw APIError.NOT_FOUND()
  }
  if (comment.user_id === req.user.id && !isGranted(req.user.role_id, 'updateOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (comment.user_id !== req.user.id && !isGranted(req.user.role_id, 'updateAny')) {
    throw APIError.FORBIDDEN()
  }

  const updatedComment = await CommentService.updateById(id, body)

  return res.json(updatedComment)
}

exports.delete = async (req, res) => {
  const { params: { id } } = req

  const comment = await CommentService.getById(id)

  if (!comment) {
    throw APIError.NOT_FOUND()
  }
  if (comment.user_id === req.user.id && !isGranted(req.user.role_id, 'deleteOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (comment.user_id !== req.user.id && !isGranted(req.user.role_id, 'deleteAny')) {
    throw APIError.FORBIDDEN()
  }

  await CommentService.deleteById(id)

  return res.json(true)
}
