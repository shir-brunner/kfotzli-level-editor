const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TEAMS = require('./enums/teams');

const characterSchema = new Schema({
    name: String,
    created: Date,
    jumpHeight: Number,
    climbSpeed: Number,
    image: String,
    speed: Number,
    width: { type: Number, default: 105 },
    height: { type: Number, default: 150 },
    team: { type: String, enum: TEAMS, required: true },
    animations: {},
});

module.exports = mongoose.model('Character', characterSchema);