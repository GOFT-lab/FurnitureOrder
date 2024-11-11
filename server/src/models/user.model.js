const createModelHelper = require('../helpers/model.helper');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET, JWT_TTL } = require('../../config');

const name = 'User';
const tableName = 'users';

const selectableProps = [
  'id',
  'email',
  'first_name',
  'last_name',
  'role',
  'email_verification_status',
  'created_at',
];

const SALT_ROUND = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUND);

const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

const beforeSave = async (user) => {
  if (!user.password) return user;
  const hash = await hashPassword(user.password);
  return { ...user, password: hash };
};

module.exports = (knex) => {
  const userHelper = createModelHelper({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const create = (props) => beforeSave(props).then(userHelper.create);

  const verify = async (email, password) => {
    const [user] = await knex.select().from(tableName).where({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) throw new Error('Incorrect password');

    const { password: _, ...userWithoutPassword } = user;
    const token = jsonwebtoken.sign(userWithoutPassword, JWT_SECRET, {
      expiresIn: JWT_TTL,
    });
    return { ...userWithoutPassword, token };
  };

  const findById = async (id) => {
    //console.log(`ID: ${id}`);
    const [user] = await knex(tableName)
      .select(selectableProps)
      .where({ id: id });
    return user || null;
  };

  return {
    name,
    ...userHelper,
    create,
    verify,
    findById,
  };
};
