const Joi = require('joi')

const create = Joi.object({
  title: Joi.string()
    .min(2)
    .max(200)
    .required(),

  content: Joi.string()
    .min(10)
    .max(10000)
    .required(),

  private: Joi.boolean()
    .required(),
})

const update = Joi.object({
  title: Joi.string()
    .min(2)
    .max(200),

  content: Joi.string()
    .min(10)
    .max(10000),

  private: Joi.boolean()
})

module.exports = {
  create,
  update,
}
