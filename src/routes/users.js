const { Router } = require('express')
const { UserController } = require('../controllers')
const { authorize } = require('../middlewares/auth')

const router = Router()

router.post('/', authorize, UserController.create)
router.get('/', authorize, UserController.findAll)
router.get('/:id', authorize, UserController.findOne)
router.put('/:id', authorize, UserController.update)
router.delete('/:id', authorize, UserController.delete)

module.exports = router
