const { Router } = require('express')
const { LikeController } = require('../controllers')
const { authorize } = require('../middlewares/auth')

const router = Router()

router.post('/', authorize, LikeController.create)
router.get('/', authorize, LikeController.findAll)
router.get('/:id', authorize, LikeController.findOne)
router.put('/:id', authorize, LikeController.update)
router.delete('/:id', authorize, LikeController.delete)

module.exports = router
