const { Router } = require('express')
const { LikeController } = require('../controllers')
const { authorize } = require('../middlewares/auth')
const errorHandler = require('../utils/errorHandler')

const router = Router()

router.post('/', authorize, errorHandler(LikeController.create))
router.delete('/', authorize, errorHandler(LikeController.delete))

module.exports = router
