
exports.up = async function(knex) {
  return knex.schema.hasTable('posts').then(function(exists) {
    if (exists) return

    return knex.schema.createTable('posts', table => {
      // Columns.
      table.uuid('id').notNullable().primary()
      table.string('title', 100).notNullable()
      table.string('content', 10000).notNullable()
      table.boolean('private').notNullable().defaultTo(false)
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())

      table.index(['user_id'])
    })
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('posts')
}
