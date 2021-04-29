
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert([
        { id: 'user', name: 'User' },
        { id: 'editor', name: 'Editor' },
        { id: 'admin', name: 'Admin' },
      ]);
    });
};
