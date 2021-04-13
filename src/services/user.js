const db = require('../models')
const dbName = 'users'

exports.create = async (data) => {
  return db(dbName).insert(data)
}

exports.getAll = async ({ query }) => {
  return db(dbName).where(query)
}

exports.getById = async (id) => {
  return db(dbName).where({ id }).first()
}

exports.updateById = async (id, data) => {
  return db(dbName).where({ id }).update(data)
}

exports.deleteById = async (id) => {
  return db(dbName).where({ id }).del()
}

exports.getByName = async (username) => {
  return db(dbName).where({ username }).first()
}
