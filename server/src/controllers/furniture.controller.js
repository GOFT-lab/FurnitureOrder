const knex = require('../../database/connection');
const Furniture = require('../models/furniture.model')(knex);
const {
  createError,
  BAD_REQUEST,
  NOT_FOUND,
} = require('../helpers/error.helper');

const getAllFurniture = async (req, res, next) => {
  try {
    const furnitureItems = await Furniture.findAll();
    res.json({
      ok: true,
      furnitureItems,
    });
  } catch (e) {
    console.error('Error fetching furniture items:', e);
    next(e);
  }
};

const getFurnitureById = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(
      createError({
        status: BAD_REQUEST,
        message: 'Furniture ID is required',
      })
    );
  }

  try {
    const furniture = await Furniture.findById(id);

    if (!furniture) {
      return next(
        createError({
          status: NOT_FOUND,
          message: 'Furniture not found',
        })
      );
    }

    res.json({
      ok: true,
      furniture,
    });
  } catch (e) {
    console.error('Error fetching furniture by ID:', e);
    next(e);
  }
};

const createFurniture = async (req, res, next) => {
  const { name, type, price, quantity, description } = req.body;

  if (!name || !type || !price || !quantity || !description) {
    return next(
      createError({
        status: BAD_REQUEST,
        message:
          'Name, type, price, quantity, and description are required fields',
      })
    );
  }

  try {
    const newFurniture = await Furniture.create({
      name,
      type,
      price,
      quantity,
      description,
    });

    res.json({
      ok: true,
      message: 'Furniture item created successfully',
      furniture: newFurniture,
    });
  } catch (e) {
    console.error('Error creating furniture item:', e);
    next(e);
  }
};

const updateFurniture = async (req, res, next) => {
  const { id } = req.params;
  const { name, type, price, quantity, description } = req.body;

  if (!id) {
    return next(
      createError({
        status: BAD_REQUEST,
        message: 'Furniture ID is required',
      })
    );
  }

  try {
    const furniture = await Furniture.findById(id);

    if (!furniture) {
      return next(
        createError({
          status: NOT_FOUND,
          message: 'Furniture not found',
        })
      );
    }

    const updatedFurniture = await Furniture.update(id, {
      name,
      type,
      price,
      quantity,
      description,
    });

    res.json({
      ok: true,
      message: 'Furniture item updated successfully',
      furniture: updatedFurniture,
    });
  } catch (e) {
    console.error('Error updating furniture item:', e);
    next(e);
  }
};

const deleteFurniture = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(
      createError({
        status: BAD_REQUEST,
        message: 'Furniture ID is required',
      })
    );
  }

  try {
    const furniture = await Furniture.findById(id);

    if (!furniture) {
      return next(
        createError({
          status: NOT_FOUND,
          message: 'Furniture not found',
        })
      );
    }

    await Furniture.delete(id);

    res.json({
      ok: true,
      message: 'Furniture item deleted successfully',
    });
  } catch (e) {
    console.error('Error deleting furniture item:', e);
    next(e);
  }
};

module.exports = {
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
};
