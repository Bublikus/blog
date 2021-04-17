const Joi = require('joi')

const create = Joi.object({
  comment: Joi.string()
    .max(1000)
    .required(),
})

module.exports = {
  create,
}
