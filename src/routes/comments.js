const { Router } = require('express')
const { CommentController } = require('../controllers')
const { authorize } = require('../middlewares/auth')
const errorHandler = require('../utils/errorHandler')

const router = Router()

router.post('/', authorize, errorHandler(CommentController.create))
router.get('/', authorize, errorHandler(CommentController.findAll))
router.get('/:id', authorize, errorHandler(CommentController.findOne))
router.put('/:id', authorize, errorHandler(CommentController.update))
router.delete('/:id', authorize, errorHandler(CommentController.delete))

module.exports = router
