const prefabService = require('../services/prefab');

module.exports = {
    getAll(req, res) {
        prefabService.getAll().then(prefabs => res.status(200).send(prefabs));
    },

    create(req, res) {
        prefabService.create(req.body).then(prefab => res.status(201).send(prefab));
    },

    update(req, res) {
        prefabService.update(req.params.prefabId, req.body).then(prefab => res.status(200).send(prefab));
    },

    delete(req, res) {
        prefabService.delete(req.params.prefabId).then(() => res.status(204).send());
    }
};