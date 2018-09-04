const BaseService = require('./base_service');
const Character = require('../models/character');

class CharacterService extends BaseService {
    constructor() {
        super(Character);
    }
}

module.exports = new CharacterService();