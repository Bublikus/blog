const Joi = require('joi')

const create = Joi.object({
  user_id: Joi.string(),

  post_id: Joi.string(),

  comment_id: Joi.string(),
})

module.exports = {
  create,
}
