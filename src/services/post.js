const shortid = require('shortid')
const db = require('../models')
const { postSchema } = require('../schemas')
const validate = require('../middlewares/validate')
const deleteUndefinedFields = require('../utils/deleteUndefinedFields')

const dbName = 'posts'

exports.create = async (data) => {
  await validate(postSchema.create)({ body: data })

  const entity = {
    id: shortid.generate(),
    title: data.title,
    content: data.content,
    private: data.private || false,
    user_id: data.user_id,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
  }

  await db(dbName).insert(entity)

  return entity
}

exports.getAll = async ({ query }) => {
  return db(dbName).where(query)
}

exports.getById = async (id) => {
  return db(dbName).where({ id }).first()
}

exports.updateById = async (id, data) => {
  await validate(postSchema.update)({ body: data })

  const entity = deleteUndefinedFields({
    title: data.title,
    content: data.content,
    private: data.private,
    updated_at: new Date(Date.now()),
  })

  await db(dbName).where({ id }).update(entity)

  return entity
}

exports.deleteById = async (id) => {
  return db(dbName).where({ id }).del()
}
