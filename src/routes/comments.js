const { Router } = require('express')
const { CommentController } = require('../controllers')
const { authorize } = require('../middlewares/auth')
const errorHandler = require('../utils/errorHandler')

const router = Router()

router.get('/', authorize, errorHandler(CommentController.findAll))
router.post('/', authorize, errorHandler(CommentController.create))
router.put('/:id', authorize, errorHandler(CommentController.update))
router.delete('/:id', authorize, errorHandler(CommentController.delete))

module.exports = router
