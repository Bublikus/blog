
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('likes').del()
    .then(function () {
      // Inserts seed entries
      return knex('likes').insert([
        {
          id: '1',
          user_id: '1',
          post_id: null,
          comment_id: '1',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '2',
          user_id: '2',
          post_id: null,
          comment_id: '2',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '3',
          user_id: '3',
          post_id: null,
          comment_id: '3',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '4',
          user_id: '1',
          post_id: '2',
          comment_id: null,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '5',
          user_id: '2',
          post_id: '2',
          comment_id: null,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '6',
          user_id: '3',
          post_id: '3',
          comment_id: null,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '7',
          user_id: '2',
          post_id: null,
          comment_id: '3',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
      ]);
    });
};
