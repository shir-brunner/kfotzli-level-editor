const BaseService = require('./base_service');
const Prefab = require('../models/prefab');

class PrefabService extends BaseService {
    constructor() {
        super(Prefab);
    }
}

module.exports = new PrefabService();