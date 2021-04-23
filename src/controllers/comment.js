const { CommentService, LikeService } = require('../services')
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
  comment.likes = 0
  comment.is_liked = false

  return res.json(comment)
}

exports.findAll = async (req, res) => {
  const { query } = req

  if (!isGranted(req.user.role_id, 'readAny')) {
    throw APIError.FORBIDDEN()
  }

  const comments = await CommentService.getAll({ query })

  let filteredLikedComments = []
  if (req.user.id) {
    const likedComments = await LikeService.getAllByComments({ query: { user_id: req.user.id }, select: ['comment_id'] })
    filteredLikedComments = likedComments.map(p => p.comment_id)
  }

  const resultComments = comments.map(p => ({ ...p, is_liked: filteredLikedComments.includes(p.id) }))

  return res.json(resultComments)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const comment = await CommentService.getById(id)

  if (!comment) {
    throw APIError.NOT_FOUND()
  }

  comment.is_liked = req.user.id ? !!await LikeService.getOneByQuery({ comment_id: comment.id, user_id: req.user.id }) : false

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
  updatedComment.user_id = req.user.id
  updatedComment.user_id = req.user.id
  updatedComment.likes = comment.likes
  updatedComment.is_liked = comment.is_liked
  updatedComment.post_id = comment.post_id
  updatedComment.created_at = comment.created_at

  return res.json({ ...comment, ...updatedComment })
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
