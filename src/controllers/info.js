const infoService = require('../services/info');

module.exports = {
    get(req, res) {
        infoService.get().then(info => res.status(200).send(info));
    }
};