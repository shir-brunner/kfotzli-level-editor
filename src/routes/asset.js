const express = require('express');
const controller = require('../controllers/asset');
let router = module.exports = express.Router();

router.get('/', controller.get);