const { userValidation } = require('../validators')
const db = require('../models')
const dbName = 'users'

exports.create = async (data) => {
  userValidation.validateUsername(data.username)

  return db(dbName).insert(data)
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
  userValidation.validateUsername(data.username)

  return db(dbName).where({ id }).update(data)
}

exports.deleteById = async (id) => {
  return db(dbName).where({ id }).del()
}

exports.getByName = async (username) => {
  return db(dbName).where({ username }).first()
}
