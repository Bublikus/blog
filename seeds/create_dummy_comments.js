
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('comments').insert([
        {
          id: '1',
          comment: 'My Very First Comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ',
          user_id: '1',
          post_id: '1',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '2',
          comment: 'The Second Comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          user_id: '2',
          post_id: '2',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },

        {
          id: '3',
          comment: '3rd Post. Lorem ipsum dolor sit amet',
          user_id: '2',
          post_id: '2',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
      ]);
    });
};
