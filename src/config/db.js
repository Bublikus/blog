module.exports = {
  CLIENT: 'mysql',
  HOST: 'localhost', // 'mysql_server',
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
