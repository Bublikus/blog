const { Router } = require('express')
const { UserController } = require('../controllers')
const { authorize } = require('../middlewares/auth')
const errorHandler = require('../utils/errorHandler')

const router = Router()

router.post('/', authorize, errorHandler(UserController.create))
router.get('/', authorize, errorHandler(UserController.findAll))
router.get('/me', authorize, errorHandler(UserController.getMe))
router.get('/:id', authorize, errorHandler(UserController.findOne))
router.put('/:id', authorize, errorHandler(UserController.update))
router.delete('/:id', authorize, errorHandler(UserController.delete))

module.exports = router
