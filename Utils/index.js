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

    static async getChannelObjectByName(guild, channelName) {
        return await guild.channels.find(x => x.name === channelName);
    }

    static async getChannelObjectById(guild, channelId) {
        return await guild.channels.find(x => x.id === channelId);
    }

    static async doesChannelExist(guild, channelName) {
        return await Utils.getChannelObjectByName(guild, channelName) !== null;
    }

    static getMessageFormatedContent(messageObject) {
        // Get message content
        let content = messageObject.content.trim();

        // Replace mentiones user ids with their nicknames or usernames if nicknames are not set
        messageObject.mentions.members.forEach(member => {
            const memberName = !member.nickname ? member.user.username : member.nickname;

            content = content.replace(`<@!${member.id}>`, `@${memberName}`).trim();
            content = content.replace(`<@${member.id}>`, `@${memberName}`).trim();
            content = content.replace(`<@&${member.id}>`, `@${memberName}`).trim();
        });

        // Replace channel ids with channel names
        messageObject.guild.channels.forEach(channel => content = content.replace(`<#${channel.id}>`, `#${channel.name}`).trim());

        return content;
    }
}

module.exports = Utils;