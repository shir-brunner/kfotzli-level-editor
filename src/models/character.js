const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    name: String,
    created: Date,
    jumpHeight: Number,
    image: String,
    speed: Number,
    animations: {},
});

module.exports = mongoose.model('Character', characterSchema);