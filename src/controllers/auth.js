const { AuthService } = require('../services')

exports.login = async (req, res) => {
  const data = await AuthService.login(req.body)
  return res.json(data)
}

exports.register = async (req, res) => {
  const data = await AuthService.register(req.body)
  return res.json(data)
}
