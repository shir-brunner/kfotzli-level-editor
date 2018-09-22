const mongoose = require('mongoose');
const GameObjectSchema = require('./game_object').schema;
const Schema = mongoose.Schema;
const TEAMS = require('./enums/teams');
const GAMEPLAYS = require('./enums/gameplays');
const _ = require('lodash');

const levelSchema = new Schema({
    name: String,
    created: Date,
    size: {
        width: Number,
        height: Number
    },
    background: String,
    gameplay: {
        name: {
            type: String,
            enum: GAMEPLAYS,
            required: true
        },
        rules: {}
    },
    gameObjects: [GameObjectSchema],
    spawnPoints: [{
        x: Number,
        y: Number,
        team: { type: String, enum: TEAMS },
        image: String
    }],
    teams: [],
    minPlayers: { type: Number, default: 2 }
});

levelSchema.pre('save', function(next) {
    this.teams = [];
    this.spawnPoints.forEach(spawnPoint => {
        if(this.teams.indexOf(spawnPoint.team) === -1)
            this.teams.push(spawnPoint.team);
    });
    if(this.teams.length === 1)
        this.teams = [];
    next();
});

module.exports = mongoose.model('Level', levelSchema);