const mongoose = require('mongoose');
const GameObjectSchema = require('./game_object').schema;
const Schema = mongoose.Schema;

const levelSchema = new Schema({
    name: String,
    created: Date,
    size: {
        width: Number,
        height: Number
    },
    background: String,
    gameObjects: [GameObjectSchema],
    spawnPoints: [{
        x: Number,
        y: Number
    }],
    minPlayers: { type: Number, default: 2 }
});

module.exports = mongoose.model('Level', levelSchema);