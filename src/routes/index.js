const { Router } = require('express')
const response = require('../utils/response')

const AuthRouter = require('./auth')
const UserRouter = require('./users')
const PostRouter = require('./posts')
const CommentRouter = require('./comments')

const router = Router()

router.use('/auth', AuthRouter)
router.use('/users', UserRouter)
router.use('/posts', PostRouter)
router.use('/comments', CommentRouter)

router.get('*', (req, res) => res.status(404).send(response.error('Route not found')))

module.exports = router
