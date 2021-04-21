const shortid = require('shortid')
const { userSchema } = require('../schemas')
const validate = require('../middlewares/validate')
const db = require('../models')
const deleteUndefinedFields = require('../utils/deleteUndefinedFields')

const dbName = 'users'

exports.create = async (data) => {
  await validate(userSchema.create)({ body: data })

  const entity = {
    id: shortid.generate(),
    username: data.username,
    hash: data.hash,
    salt: data.salt,
    role_id: data.role_id,
    avatar_id: data.avatar_id,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
  }

  await db(dbName).insert(entity)

  return entity
}

exports.getAll = async ({ query }) => {
  return db(dbName).select([
    'id',
    'username',
    'role_id',
    'avatar_id',
    'created_at',
    'updated_at',
  ]).where(query)
}

exports.getById = async (id) => {
  return db(dbName).where({ id }).first()
}

exports.updateById = async (id, data) => {
  await validate(userSchema.update)({ body: data })

  const entity = deleteUndefinedFields({
    username: data.username,
    avatar_id: data.avatar_id,
    updated_at: new Date(Date.now()),
  })

  db(dbName).where({ id }).update(entity)

  return { id, ...entity }
}

exports.deleteById = async (id) => {
  return db(dbName).where({ id }).del()
}

exports.getByName = async (username) => {
  return db(dbName).where({ username }).first()
}
