const fs = require('fs');
const path = require('path');
const knex = require('../../database/connection');
const debug = require('debug')('order:modelIndex');

const getModelFiles = (dir) =>
  fs
    .readdirSync(dir)
    .filter((file) => file.indexOf('.') !== -1 && file !== 'index.js')
    .map((file) => path.resolve(dir, file));

const files = getModelFiles(__dirname);
debug('Found model files:', files);

const models = files.reduce((modelObj, filename) => {
  try {
    const initModel = require(filename);
    const model = initModel(knex);

    if (model) {
      modelObj[model.name] = model;
      debug(`Initialized model: ${model.name}`);
    }
  } catch (error) {
    console.error(`Error initializing model from file ${filename}:`, error);
  }
  return modelObj;
}, {});

module.exports = models;
