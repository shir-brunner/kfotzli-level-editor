const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    x: Number,
    y: Number,
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 },
    image: String,
    stuckable: { type: Boolean, default: false },
    climbable: { type: Boolean, default: false },
    bumpable: { type: Boolean, default: false },
    bumpHeight: { type: Number, required: false },
    obstacle: { type: Boolean, default: false },
    padding: {
        left: Number,
        top: Number,
        right: Number,
        bottom: Number
    },
    animations: {}
};

const gameObjectSchema = new Schema(fields);

module.exports = mongoose.model('GameObject', gameObjectSchema);
module.exports.schema = gameObjectSchema;
module.exports.fields = fields;