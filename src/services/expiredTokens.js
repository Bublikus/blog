const db = require('../models')
const dbName = 'expiredTokens'

exports.create = async (data) => {
  return db(dbName).insert(data)
}

exports.getByToken = async (token) => {
  return db(dbName).where({ token }).first()
}

exports.deleteByToken = async (token) => {
  return db(dbName).where({ token }).del()
}
