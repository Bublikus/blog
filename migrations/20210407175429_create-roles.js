
exports.up = async function(knex) {
  return knex.schema.hasTable('roles').then(function(exists) {
    if (exists) return

    return knex.schema.createTable('roles', table => {
      // Columns.
      table.string('id').notNullable().primary()
      table.string('name').notNullable()
    })
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('roles')
}
