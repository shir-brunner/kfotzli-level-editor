const express = require('express');
const controller = require('../controllers/prefab');

let router = module.exports = express.Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:prefabId', controller.update);
router.delete('/:prefabId', controller.delete);