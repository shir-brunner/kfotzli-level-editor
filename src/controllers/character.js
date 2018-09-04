const characterService = require('../services/character');

module.exports = {
    getAll(req, res) {
        characterService.getAll().then(characters => res.status(200).send(characters));
    },

    create(req, res) {
        characterService.create(req.body).then(character => res.status(201).send(character));
    },

    update(req, res) {
        characterService.update(req.params.characterId, req.body).then(character => res.status(200).send(character));
    },

    delete(req, res) {
        characterService.delete(req.params.characterId).then(() => res.status(204).send());
    }
};