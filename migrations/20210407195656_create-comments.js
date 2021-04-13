
exports.up = async function(knex) {
  return knex.schema.hasTable('comments').then(function(exists) {
    if (exists) return

    return knex.schema.createTable('comments', table => {
      // Columns.
      table.uuid('id').notNullable().primary()
      table.string('comment', 10000).notNullable()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('post_id').references('id').inTable('posts').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('comments')
}
