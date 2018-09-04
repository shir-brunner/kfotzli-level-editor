const express = require('express');
const controller = require('../controllers/info');
let router = module.exports = express.Router();

router.get('/', controller.get);