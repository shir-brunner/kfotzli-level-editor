const fs = require('fs');
const Promise = require('bluebird');

class AssetService {
    get() {
        return Promise.props({
            backgrounds: getImageFiles('backgrounds'),
            grounds: getImageFiles('ground'),
            items: getImageFiles('items'),
            creatures: getImageFiles('enemies'),
            characters: getImageFiles('characters'),
            buildings: getImageFiles('buildings'),
            ice: getImageFiles('ice')
        });
    }
}

const getImageFiles = Promise.promisify(function (folderName, done) {
    let baseImgPath = 'public/img/' + folderName;

    fs.readdir(baseImgPath, (err, files) => {
        if (err) {
            done(err);
            return;
        }
        done(null, files);
    });
});

module.exports = new AssetService();