/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('furniture').del();

  await knex('furniture').insert([
    {
      name: 'Desk',
      type: 'Desk',
      price: 1500.0,
      quantity: 10,
      description: 'Sturdy office desk, perfect for working.',
    },
    {
      name: 'Chair',
      type: 'Chair',
      price: 500.0,
      quantity: 25,
      description:
        'Comfortable chair with a soft backrest, great for home and office use.',
    },
    {
      name: 'Sofa',
      type: 'Sofa',
      price: 8000.0,
      quantity: 5,
      description:
        'Comfortable sofa upholstered with high-quality fabric and removable cushions.',
    },
    {
      name: 'Wardrobe',
      type: 'Wardrobe',
      price: 3000.0,
      quantity: 8,
      description:
        'Spacious wardrobe with several shelves, suitable for storing clothes and other items.',
    },
    {
      name: 'Armchair',
      type: 'Armchair',
      price: 2000.0,
      quantity: 12,
      description: 'Ergonomic armchair with adjustable height and backrest.',
    },
  ]);
};
