const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gameObjectSchema = require('./game_object');
const _ = require('lodash');

const prefabSchema = new Schema(_.assign({}, gameObjectSchema.fields, {
    name: { type: String, required: true },
    created: Date,
}));

module.exports = mongoose.model('Prefab', prefabSchema);