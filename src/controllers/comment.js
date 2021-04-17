const shortid = require('shortid')
const { CommentService } = require('../services')
const { roles } = require('../utils/roles')
const validate = require('../middlewares/validate')
const { commentSchema } = require('../schemas')
const APIError = require('../utils/errorAPI')

const isGranted = (role, action) => roles.can(role)[action]('comment').granted

exports.create = async (req, res) => {
  const { body } = req

  if (!isGranted(req.user.role_id, 'createOwn')) {
    throw APIError.FORBIDDEN()
  }

  await validate(commentSchema.create)(req)

  body.id = shortid.generate()

  await CommentService.create(body)

  const comment = await CommentService.getById(body.id)

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

  await validate(commentSchema.create)(req)

  await CommentService.updateById(id, body)

  const data = await CommentService.getById(id)

  return res.json(data)
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
