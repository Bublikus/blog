const { Router } = require('express')
const { PostController } = require('../controllers')
const { authorize } = require('../middlewares/auth')

const router = Router()

router.post('/', authorize, PostController.create)
router.get('/', authorize, PostController.findAll)
router.get('/:id', authorize, PostController.findOne)
router.put('/:id', authorize, PostController.update)
router.delete('/:id', authorize, PostController.delete)

module.exports = router
