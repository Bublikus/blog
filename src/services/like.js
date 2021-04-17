const db = require('../models')
const dbName = 'likes'

exports.create = async (data) => {
  const entity = {
    ...data,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
  }

  return db(dbName).insert(entity)
}

exports.getAll = async ({ query }) => {
  return db(dbName).where(query)
}

exports.getById = async (id) => {
  return db(dbName).where({ id }).first()
}

exports.updateById = async (id, data) => {
  const entity = {
    ...data,
    updated_at: new Date(Date.now()),
  }

  return db(dbName).where({ id }).update(entity)
}

exports.deleteById = async (id) => {
  return db(dbName).where({ id }).del()
}
