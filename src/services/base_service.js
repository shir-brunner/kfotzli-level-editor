const _ = require('lodash');

module.exports = class BaseService {
    constructor(model) {
        this._model = model;
    }

    getAll() {
        return this._model.find();
    }

    create(params) {
        let instance = new this._model(_.omit(params, ['_id']));
        instance.created = new Date();
        return instance.save();
    }

    async update(id, params) {
        let instance = await this._model.findOne({ _id: id });
        if(!instance)
            throw new Exception('Object not found');

        _.assign(instance, _.omit(params, ['_id']));
        return instance.save();
    }

    delete(id) {
        return this._model.remove({ _id: id });
    }
};