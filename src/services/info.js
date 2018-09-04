const fs = require('fs');
const Promise = require('bluebird');

class InfoService {
    get() {
        return Promise.props({
            backgrounds: getImageFiles('backgrounds'),
            groundImages: getImageFiles('ground'),
            itemImages: getImageFiles('items'),
            creaturesImages: getImageFiles('enemies'),
            charactersImages: getImageFiles('characters')
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

module.exports = new InfoService();