
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: '1',
          username: 'John Doe',
          role_id: 'admin',
          avatar_id: '1',
          salt: 'c1ef95a8997d62df3fbd2e670ef1b1d211f709453114f6f8718ef36c7048f110',
          hash: '3f12be07fe9303d9aab98e5657d030326d6e186313228beb8210c47e0c57434e5b0ee9ea8170ec87972bba3e172b03538c56a3193a073407aeb9349654df5c08',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '2',
          username: 'Edward Le',
          role_id: 'editor',
          avatar_id: '2',
          salt: 'c1ef95a8997d62df3fbd2e670ef1b1d211f709453114f6f8718ef36c7048f110',
          hash: '3f12be07fe9303d9aab98e5657d030326d6e186313228beb8210c47e0c57434e5b0ee9ea8170ec87972bba3e172b03538c56a3193a073407aeb9349654df5c08',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },

        {
          id: '3',
          username: 'Raphael Amigo',
          role_id: 'user',
          avatar_id: '3',
          salt: 'c1ef95a8997d62df3fbd2e670ef1b1d211f709453114f6f8718ef36c7048f110',
          hash: '3f12be07fe9303d9aab98e5657d030326d6e186313228beb8210c47e0c57434e5b0ee9ea8170ec87972bba3e172b03538c56a3193a073407aeb9349654df5c08',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
      ]);
    });
};

