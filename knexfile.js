const { db: dbConfig } = require('./src/config')

module.exports = {
  client: dbConfig.CLIENT,
  connection: {
    host : dbConfig.HOST,
    user : dbConfig.USER,
    password : dbConfig.PASSWORD,
    database : dbConfig.DB,
  }
}
