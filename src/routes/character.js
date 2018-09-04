const express = require('express');
const controller = require('../controllers/character');

let router = module.exports = express.Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:characterId', controller.update);
router.delete('/:characterId', controller.delete);