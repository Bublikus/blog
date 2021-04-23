const { PostService, LikeService } = require('../services')
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
  post.likes = 0
  post.is_liked = false

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

  const posts = await PostService.getAll({ query })

  let filteredLikedPosts = []
  if (req.user.id) {
    const likedPost = await LikeService.getAllByPosts({ query: { user_id: req.user.id }, select: ['post_id'] })
    filteredLikedPosts = likedPost.map(p => p.post_id)
  }

  const resultPosts = posts.map(p => ({ ...p, is_liked: filteredLikedPosts.includes(p.id) }))

  return res.json(resultPosts)
}

exports.findOne = async (req, res) => {
  const { id } = req.params

  const post = await PostService.getById(id)

  if (!post) {
    throw APIError.NOT_FOUND()
  }

  post.is_liked = req.user.id ? !!await LikeService.getOneByQuery({ post_id: post.id, user_id: req.user.id }) : false

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
  updatedPost.likes = post.likes
  updatedPost.is_liked = post.is_liked

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
