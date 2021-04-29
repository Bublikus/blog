const Joi = require('joi')

const create = Joi.object({
  username: Joi.string()
    .min(2)
    .max(50)
    .regex(/^\w+$/)
    .required(),

  hash: Joi.string()
    .required(),

  salt: Joi.string()
    .required(),

  role_id: Joi.string()
    .required(),

  avatar_id: Joi.string(),
})

const update = Joi.object({
  username: Joi.string()
    .min(2)
    .max(50)
    .regex(/^\w+$/),

  password: Joi.string()
    .min(6)
    .max(100),

  avatar_id: Joi.string(),
})

module.exports = {
  create,
  update,
}
