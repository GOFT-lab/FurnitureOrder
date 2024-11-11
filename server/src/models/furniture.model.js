const createModelHelper = require('../helpers/model.helper');

const name = 'Furniture';
const tableName = 'furniture';

const selectableProps = [
  'furniture.id',
  'furniture.name',
  'furniture.type',
  'furniture.price',
  'furniture.quantity',
  'furniture.description',
  'furniture.created_at',
  'furniture.updated_at',
  'furniture_images.image_url',
  'furniture_images.alt_text',
];

module.exports = (knex) => {
  const furnitureHelper = createModelHelper({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const create = (props) => furnitureHelper.create(props);

  const findById = async (id) => {
    const furniture = await knex(tableName)
      .join(
        'furniture_images',
        'furniture.id',
        '=',
        'furniture_images.furniture_id'
      )
      .select(selectableProps)
      .where({ 'furniture.id': id });

    if (furniture.length === 0) return null;

    // Створення результату з потрібним форматом
    const {
      id: furnitureId,
      name,
      type,
      price,
      quantity,
      description,
      created_at,
      updated_at,
    } = furniture[0];

    return {
      id: furnitureId,
      name,
      type,
      price,
      quantity,
      description,
      created_at,
      updated_at,
      images: furniture.map((item) => ({
        image_url: item.image_url,
        alt_text: item.alt_text,
      })),
    };
  };

  const findAll = async () => {
    const furnitureItems = await knex(tableName)
      .join(
        'furniture_images',
        'furniture.id',
        '=',
        'furniture_images.furniture_id'
      )
      .select(selectableProps);

    const groupedFurniture = furnitureItems.reduce((acc, item) => {
      const {
        id,
        name,
        type,
        price,
        quantity,
        description,
        created_at,
        updated_at,
        image_url,
        alt_text,
      } = item;

      // Перевірка, чи вже є об'єкт для даного id, і його створення
      if (!acc[id]) {
        acc[id] = {
          id,
          name,
          type,
          price,
          quantity,
          description,
          created_at,
          updated_at,
          images: [],
        };
      }

      // Додавання нового зображення
      acc[id].images.push({ image_url, alt_text });

      return acc;
    }, {});

    // Повернення масиву об'єктів, замість об'єкта
    return Object.values(groupedFurniture);
  };
  return {
    name,
    ...furnitureHelper,
    create,
    findById,
    findAll,
  };
};
