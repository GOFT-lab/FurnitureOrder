/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('furniture_images').del();

  await knex('furniture_images').insert([
    {
      furniture_id: 1,
      image_url: 'https://i.imgur.com/Z2IqCW1.png',
      alt_text: 'Office Desk',
    },
    {
      furniture_id: 2,
      image_url: 'https://i.imgur.com/2FRI5SN.png',
      alt_text: 'Comfortable Chair',
    },
    {
      furniture_id: 3,
      image_url: 'https://i.imgur.com/vTMCsjz.png',
      alt_text: 'Cozy Sofa',
    },
    {
      furniture_id: 4,
      image_url: 'https://i.imgur.com/E6Srroq.png',
      alt_text: 'Spacious Wardrobe',
    },
    {
      furniture_id: 5,
      image_url: 'https://i.imgur.com/sbCsDPv.png',
      alt_text: 'Ergonomic Chair',
    },
  ]);
};
