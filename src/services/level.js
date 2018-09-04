const BaseService = require('./base_service');
const Level = require('../models/level');

class LevelService extends BaseService {
    constructor() {
        super(Level);
    }
}

module.exports = new LevelService();