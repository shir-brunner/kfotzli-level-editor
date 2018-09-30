const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const chalk = require('chalk');
const moment = require('moment');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(express.static('public'));

app.use(httpRequestLogger);

app.use('/assets', require('./routes/asset'));
app.use('/levels', require('./routes/level'));
app.use('/prefabs', require('./routes/prefab'));
app.use('/characters', require('./routes/character'));

app.listen(config.port, () => console.log('Serving Level Editor on port ' + config.port));

mongoose.connection.on('connected', function () {
    console.log(chalk.green('Connected to mongo.'));
});

mongoose.connection.on('error', function (err) {
    console.log(chalk.red('Connection to mongo failed: ' + err));
});

mongoose.connect(config.db.url, { useNewUrlParser: true });

function httpRequestLogger(req, res, next) {
    if (req.method === 'OPTIONS')
        return;

    let message = moment().format('YYYY-MM-DD HH:mm:ss') + ' ';
    message += chalk.blue(req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log(message + chalk.bold(' (' + req.method + ')'));
    next();
}