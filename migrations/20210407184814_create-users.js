
exports.up = async function(knex) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (exists) return

    return knex.schema.createTable('users', table => {
      // Columns.
      table.uuid('id').notNullable().primary()
      table.string('username', 100).notNullable()
      table.string('hash').notNullable()
      table.string('salt').notNullable()
      table.string('role_id').references('id').inTable('roles').onDelete('CASCADE')
      table.uuid('avatar_id').references('id').inTable('avatars').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())

      table.index(['username'])
    })
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('users')
}
