const Joi = require('joi')

const create = Joi.object({
  user_id: Joi.string()
    .required(),

  post_id: Joi.string(),

  comment_id: Joi.string(),
}).min(2)

module.exports = {
  create,
}
