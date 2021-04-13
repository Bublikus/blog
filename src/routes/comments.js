const { Router } = require('express')
const { CommentController } = require('../controllers')
const { authorize } = require('../middlewares/auth')

const router = Router()

router.post('/', authorize, CommentController.create)
router.get('/', authorize, CommentController.findAll)
router.get('/:id', authorize, CommentController.findOne)
router.put('/:id', authorize, CommentController.update)
router.delete('/:id', authorize, CommentController.delete)

module.exports = router
