const { Router } = require('express')
const { PostController } = require('../controllers')
const { authorize } = require('../middlewares/auth')
const errorHandler = require('../utils/errorHandler')

const router = Router()

router.post('/', authorize, errorHandler(PostController.create))
router.get('/', authorize, errorHandler(PostController.findAll))
router.get('/:id', authorize, errorHandler(PostController.findOne))
router.put('/:id', authorize, errorHandler(PostController.update))
router.delete('/:id', authorize, errorHandler(PostController.delete))

module.exports = router
