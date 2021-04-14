const { Router } = require('express')
const { AuthController } = require('../controllers')
const errorHandler = require('../utils/errorHandler')

const router = Router()

router.post('/register', errorHandler(AuthController.register))
router.post('/login', errorHandler(AuthController.login))

module.exports = router
