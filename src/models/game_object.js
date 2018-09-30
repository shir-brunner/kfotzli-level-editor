const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    x: Number,
    y: Number,
    width: { type: Number },
    height: { type: Number },
    image: String,
    stuckable: { type: Boolean, default: false },
    climbable: { type: Boolean, default: false },
    bumpable: { type: Boolean, default: false },
    bumpHeight: { type: Number, required: false },
    obstacle: { type: Boolean, default: false },
    invisible: { type: Boolean, default: false },
    padding: {
        left: Number,
        top: Number,
        right: Number,
        bottom: Number
    },
    animations: {},
    identifier: String,
    stickToGrid: {
        x: { type: Boolean, default: true },
        y: { type: Boolean, default: true },
    },
    zIndex: { type: Number, default: 0 }
};

const gameObjectSchema = new Schema(fields);

module.exports = mongoose.model('GameObject', gameObjectSchema);
module.exports.schema = gameObjectSchema;
module.exports.fields = fields;