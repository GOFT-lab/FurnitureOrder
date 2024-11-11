module.exports = ({
  knex = {},
  name = 'name',
  tableName = 'tableName',
  selectableProps = [],
  timeout = 1000,
}) => {
  const create = (props) => {
    delete props.id;
    return knex
      .insert(props)
      .returning(selectableProps)
      .into(tableName)
      .timeout(timeout)
      .catch((err) => {
        console.error(`Error in create method for ${name}:`, err);
        throw err;
      });
  };

  const find = (filters) =>
    knex
      .select(selectableProps)
      .from(tableName)
      .where(filters)
      .timeout(timeout)
      .catch((err) => {
        console.error(`Error in find method for ${name}:`, err);
        throw err;
      });

  const findOne = (filters) =>
    find(filters).then((results) => results[0] || null);

  const update = (filters, props) =>
    knex(tableName)
      .update(props)
      .where(filters)
      .returning(selectableProps)
      .timeout(timeout)
      .catch((err) => {
        console.error(`Error in update method for ${name}:`, err);
        throw err;
      });

  const deleteRecord = (filters) =>
    knex(tableName)
      .del()
      .where(filters)
      .timeout(timeout)
      .catch((err) => {
        console.error(`Error in delete method for ${name}:`, err);
        throw err;
      });

  return {
    create,
    find,
    findOne,
    update,
    delete: deleteRecord,
  };
};
