const { Router } = require('express')
const { LikeController } = require('../controllers')
const { authorize } = require('../middlewares/auth')
const errorHandler = require('../utils/errorHandler')

const router = Router()

router.post('/', authorize, errorHandler(LikeController.create))
router.get('/', authorize, errorHandler(LikeController.findAll))
router.get('/:id', authorize, errorHandler(LikeController.findOne))
router.put('/:id', authorize, errorHandler(LikeController.update))
router.delete('/:id', authorize, errorHandler(LikeController.delete))

module.exports = router
