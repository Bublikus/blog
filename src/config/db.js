module.exports = {
  CLIENT: 'mysql',
  HOST: '127.0.0.1',
  USER: 'root',
  PASSWORD: 'Rolique2018',
  DB: 'blog',
  dialect: 'mysql',
  PORT: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
