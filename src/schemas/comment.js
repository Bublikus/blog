const Joi = require('joi')

const create = Joi.object({
  comment: Joi.string()
    .max(1000)
    .required(),

  user_id: Joi.string()
    .required(),

  post_id: Joi.string()
    .required(),
})

const update = Joi.object({
  comment: Joi.string()
    .max(1000)
    .required(),
})

module.exports = {
  create,
  update,
}
