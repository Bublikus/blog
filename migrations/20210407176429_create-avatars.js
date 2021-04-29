
exports.up = async function(knex) {
  return knex.schema.hasTable('avatars').then(function(exists) {
    if (exists) return

    return knex.schema.createTable('avatars', table => {
      // Columns.
      table.uuid('id').notNullable().primary()
      table.string('avatarStyle')
      table.string('topType')
      table.string('accessoriesType')
      table.string('hatColor')
      table.string('hairColor')
      table.string('facialHairType')
      table.string('facialHairColor')
      table.string('clotheType')
      table.string('clotheColor')
      table.string('eyeType')
      table.string('eyebrowType')
      table.string('mouthType')
      table.string('skinColor')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('avatars')
}
