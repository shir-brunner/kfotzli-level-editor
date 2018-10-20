const levelService = require('../services/level');

module.exports = {
    getAll(req, res) {
        levelService.getAll(req.query).then(levels => res.status(200).send(levels));
    },

    create(req, res) {
        levelService.create(req.body).then(level => res.status(201).send(level));
    },

    update(req, res) {
        levelService.update(req.params.levelId, req.body).then(level => res.status(200).send(level));
    },

    delete(req, res) {
        levelService.delete(req.params.levelId).then(() => res.status(204).send());
    }
};