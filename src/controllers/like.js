const { LikeService } = require('../services')
const { roles } = require('../utils/roles')
const deleteUndefinedFields = require('../utils/deleteUndefinedFields')
const APIError = require('../utils/errorAPI')

const isGranted = (role, action) => roles.can(role)[action]('like').granted

exports.create = async (req, res) => {
  const { body } = req

  if (!isGranted(req.user.role_id, 'createOwn')) {
    throw APIError.FORBIDDEN()
  }

  const like = await LikeService.getOneByQuery(deleteUndefinedFields({
    user_id: req.user.id,
    post_id: body.post_id,
    comment_id: body.comment_id,
  }))

  if (like) {
    return res.json(like)
  }

  body.user_id = req.user.id
  const createdLike = await LikeService.create(body)

  return res.json(createdLike)
}

exports.findAll = async (req, res) => {
  const { query } = req

  if (!isGranted(req.user.role_id, 'readAny')) {
    throw APIError.FORBIDDEN()
  }

  const data = await LikeService.getAll({ query })

  return res.json(data)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const like = await LikeService.getById(id)

  if (!like) {
    throw APIError.NOT_FOUND()
  }
  if (like.user_id === req.user.id && !isGranted(req.user.role_id, 'readOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (like.user_id !== req.user.id && !isGranted(req.user.role_id, 'readAny')) {
    throw APIError.FORBIDDEN()
  }

  return res.json(like)
}

exports.update = async (req, res) => {
  const { body, params: { id } } = req

  const like = await LikeService.getById(id)

  if (!like) {
    throw APIError.NOT_FOUND()
  }
  if (like.user_id === req.user.id && !isGranted(req.user.role_id, 'updateOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (like.user_id !== req.user.id && !isGranted(req.user.role_id, 'updateAny')) {
    throw APIError.FORBIDDEN()
  }

  const updatedLike = await LikeService.updateById(id, body)

  return res.json(updatedLike)
}

exports.delete = async (req, res) => {
  const { query } = req

  query.user_id = req.user.id
  const like = await LikeService.getOneByQuery(query)

  if (!like) {
    throw APIError.NOT_FOUND()
  }
  if (like.user_id === req.user.id && !isGranted(req.user.role_id, 'deleteOwn')) {
    throw APIError.FORBIDDEN()
  }
  if (like.user_id !== req.user.id && !isGranted(req.user.role_id, 'deleteAny')) {
    throw APIError.FORBIDDEN()
  }

  await LikeService.deleteOneByQuery(query)

  return res.json(true)
}
