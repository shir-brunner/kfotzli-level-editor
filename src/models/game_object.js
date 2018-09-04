const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fields = {
    position: {
        x: Number,
        y: Number
    },
    image: String,
    stuckable: { type: Boolean, default: false },
    climbable: { type: Boolean, default: false },
    bumpable: { type: Boolean, default: false },
    bumpHeight: { type: Number, required: false },
    causesDeath: { type: Boolean, default: false },
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