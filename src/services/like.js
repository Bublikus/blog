const shortid = require('shortid')
const db = require('../models')
const validate = require('../middlewares/validate')
const { likeSchema } = require('../schemas')
const deleteUndefinedFields = require('../utils/deleteUndefinedFields')

const dbName = 'likes'

exports.create = async (data) => {
  await validate(likeSchema.create)({ body: data })

  const entity = {
    id: shortid.generate(),
    user_id: data.user_id,
    post_id: data.post_id,
    comment_id: data.comment_id,
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

exports.getOneByQuery = async (query) => {
  await validate(likeSchema.create)({ body: query })

  return db(dbName).where(query).first()
}

exports.updateById = async (id, data) => {
  const entity = deleteUndefinedFields({
    updated_at: new Date(Date.now()),
  })

  await db(dbName).where({ id }).update(entity)

  return { id, ...entity }
}

exports.deleteById = async (id) => {
  return db(dbName).where({ id }).del()
}

exports.deleteOneByQuery = async (query) => {
  await validate(likeSchema.create)({ body: query })

  return db(dbName).where(query).first().del()
}
