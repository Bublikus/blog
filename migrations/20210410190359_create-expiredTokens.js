
exports.up = async function(knex) {
  return knex.schema.hasTable('expiredTokens').then(function(exists) {
    if (exists) return

    return knex.schema.createTable('expiredTokens', table => {
      // Columns.
      table.string('token').notNullable()
      table.date('expires_in').notNullable()
    })
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('expiredTokens')
}
