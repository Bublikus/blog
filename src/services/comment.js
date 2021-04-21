const shortid = require('shortid')
const db = require('../models')
const validate = require('../middlewares/validate')
const { commentSchema } = require('../schemas')
const deleteUndefinedFields = require('../utils/deleteUndefinedFields')

const dbName = 'comments'

exports.create = async (data) => {
  await validate(commentSchema.create)({ body: data })

  const entity = {
    id: shortid.generate(),
    comment: data.comment,
    user_id: data.user_id,
    post_id: data.post_id,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
  }

  await db(dbName).insert(entity)

  return entity
}

exports.getAll = async ({ query }) => {
  await validate(commentSchema.getAll)({ body: query })

  return db(dbName).where(query)
}

exports.getById = async (id) => {
  return db(dbName).where({ id }).first()
}

exports.updateById = async (id, data) => {
  await validate(commentSchema.update)({ body: data })

  const entity = deleteUndefinedFields({
    comment: data.comment,
    updated_at: new Date(Date.now()),
  })

  await db(dbName).where({ id }).update(entity)

  return { id, ...entity }
}

exports.deleteById = async (id) => {
  return db(dbName).where({ id }).del()
}
