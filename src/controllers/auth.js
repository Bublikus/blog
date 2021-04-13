const { AuthService } = require('../services')

exports.login = async (req, res, next) => {
  try {
    const data = await AuthService.login(req.body)
    return res.json(data)
  } catch (e) { next(e) }
}

exports.register = async (req, res, next) => {
  try {
    const data = await AuthService.register(req.body)
    return res.json(data)
  } catch (e) { next(e) }
}
