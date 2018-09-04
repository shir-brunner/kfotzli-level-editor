const express = require('express');
const controller = require('../controllers/level');

let router = module.exports = express.Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:levelId', controller.update);
router.delete('/:levelId', controller.delete);