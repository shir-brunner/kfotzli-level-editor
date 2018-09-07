const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    name: String,
    created: Date,
    jumpHeight: Number,
    image: String,
    speed: Number,
    width: { type: Number, default: 131 },
    height: { type: Number, default: 188 },
    animations: {},
});

module.exports = mongoose.model('Character', characterSchema);