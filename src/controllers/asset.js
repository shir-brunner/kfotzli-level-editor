const assetService = require('../services/asset');

module.exports = {
    get(req, res) {
        assetService.get().then(info => res.status(200).send(info));
    }
};