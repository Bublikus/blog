
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('avatars').del()
    .then(function () {
      // Inserts seed entries
      return knex('avatars').insert([
        {
          id: '1',
          avatarStyle: 'Circle',
          topType: 'WinterHat4',
          accessoriesType: 'Prescription01',
          hatColor: 'Gray01',
          hairColor: 'BrownDark',
          facialHairType: 'BeardLight',
          facialHairColor: 'Red',
          clotheType: 'BlazerShirt',
          clotheColor: 'Blue03',
          eyeType: 'Close',
          eyebrowType: 'UnibrowNatural',
          mouthType: 'Tongue',
          skinColor: 'Pale',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: '2',
          avatarStyle: 'Circle',
          topType: 'WinterHat2',
          accessoriesType: 'Kurt',
          hatColor: 'Black',
          facialHairType: 'Blank',
          facialHairColor: 'Black',
          clotheType: 'ShirtScoopNeck',
          clotheColor: 'Heather',
          eyeType: 'Dizzy',
          eyebrowType: 'UpDown',
          mouthType: 'Tongue',
          skinColor: 'DarkBrown',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },

        {
          id: '3',
          avatarStyle: 'Circle',
          topType: 'LongHairFro',
          accessoriesType: 'Blank',
          hatColor: 'Gray01',
          hairColor: 'BrownDark',
          facialHairType: 'MoustacheMagnum',
          facialHairColor: 'BlondeGolden',
          clotheType: 'Overall',
          clotheColor: 'White',
          eyeType: 'Hearts',
          eyebrowType: 'Angry',
          mouthType: 'Eating',
          skinColor: 'Brown',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
      ]);
    });
};
