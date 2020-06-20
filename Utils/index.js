const FileSystem = require('fs');
const Axios = require('axios');

class Utils {
    static async downloadFromURL(url, path) {
        const writer = FileSystem.createWriteStream(path);
        const response = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    static getExtension(name) {
        const fileNameParts = name.split(".");
        return fileNameParts[fileNameParts.length - 1];
    }

    static getAttachmentType(name) {
        if (name.lastIndexOf('.') === -1)
            return 'File';

        const extension = Utils.getExtension(name);

        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'bmp' || extension === 'webp')
            return 'Image';

        if (extension === 'mp4' || extension === 'mov' || extension === 'webm')
            return 'Video';

        return `File (${extension})`;
    }

    static async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++)
            await callback(array[index], index, array);
    }

    static getBinarySize(string) {
        return Buffer.byteLength(string, 'utf8');
    }

    static commandHasExecuteMethod(commandObject) {
        return (commandObject && typeof commandObject['execute'] && (typeof commandObject['execute'] === 'function'));
    }

    static commandHasAValidName(commandObject) {
        return (commandObject && commandObject.hasOwnProperty('name') !== false);
    }
}

module.exports = Utils;