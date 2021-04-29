const { db: dbConfig } = require('./src/config')

module.exports = {
  client: dbConfig.CLIENT,
  connection: {
    host : dbConfig.HOST,
    user : dbConfig.USER,
    password : dbConfig.PASSWORD,
    database : dbConfig.DB,
    typeCast(field, next) {
      if (field.type === 'TINY' && field.length === 1) {
        const value = field.string()
        return value ? (value === '1') : null
      }
      return next()
    }
  }
}
