const db = require('../models')
const dbName = 'posts'

exports.create = async (data) => {
  const entity = {
    id: data.id,
    title: data.title,
    content: data.content,
    private: data.private || false,
    user_id: data.user_id,
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
    title: data.title,
    content: data.content,
    private: data.private,
    updated_at: new Date(Date.now()),
  }
  return db(dbName).where({ id }).update(entity)
}

exports.deleteById = async (id) => {
  return db(dbName).where({ id }).del()
}
