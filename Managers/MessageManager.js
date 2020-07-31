const Message = require('../Model/Message');
const Statistics = require('../Model/Statistics');
const BotConfig = require('../BotConfig');
const Utils = require('../Utils');
const Path = require('path');
const FileSystem = require('fs');
const ReplicationManager = require('./ReplicationManager');

class MessageManager {
    static async archiveMessage(client, messageObject) {
        if (BotConfig.debug)
            console.log(`----------------------------------------------[ DEBUG ]----------------------------------------------`.cyan);

        let content = Utils.getMessageFormatedContent(messageObject);

        if (BotConfig.debug && content && content.length)
            console.log(`Message after the formatting: [${content}]`.green);

        // Extract message author information
        const authorId = messageObject.author.id;
        const authorName = !messageObject.author.nickname ? messageObject.author.username : messageObject.author.nickname;

        const found = await Message.exists({
            authorId: messageObject.author.id,
            timestamp: messageObject.createdTimestamp,
            channelName: messageObject.channel.name,
            message: content
        }, { timeout: false });

        if (found) {
            console.log(found);

            if (BotConfig.debug)
                console.log('This message has already been archived, skipping!');

            return;
        }

        // Get information about attachments in the message if there are any
        const Attachments = (messageObject.attachments).array();
        const foundAttachments = new Array();

        if (Attachments && Attachments.length > 0) {
            Attachments.forEach(attachment => {
                if (!attachment)
                    return;

                const url = attachment.url;
                const name = url.substr(url.lastIndexOf('/') + 1);
                foundAttachments.push({ name, url });
            });
        }

        let downloadedAttachments = new Array();

        // Calculate the total message size in bytes (excluding attachments)
        let totalBytes = Utils.getBinarySize(content);

        // Skip empty messages
        if (foundAttachments.length === 0 && !content)
            return;

        // Download found attachments if there are any
        if (foundAttachments.length > 0) {
            if (BotConfig.debug)
                console.log(`Found `.green + `${foundAttachments.length}`.cyan + ` attachments`.green);

            if (BotConfig.debug)
                console.log(`Downloading attachments ...`.green);

            await Utils.asyncForEach(foundAttachments, async attachment => {
                // Create the base path into which we will download the attachments
                const basePath = Path.resolve(process.cwd(), BotConfig.attachments_path);

                // Check if the base path does not exists, if so, create it
                if (!FileSystem.existsSync(basePath))
                    FileSystem.mkdirSync(basePath);

                // Create a full path to the file where the attachment will be stored
                let path = Path.resolve(basePath, attachment.name);

                // If we already have an attachment with the same name, add some numbers to it's name, so we do not override the existion one
                while (FileSystem.existsSync(path)) {
                    if (attachment.name.lastIndexOf('.') !== -1) {
                        const fileExtension = Utils.getExtension(attachment.name);
                        attachment.name = `${attachment.name.replace(`.${fileExtension}`, '').trim()}_${Math.floor(Math.random() * 999)}.${fileExtension}`;
                    } else attachment.name = attachment.name.concat(`_${Math.floor(Math.random() * 999)}`);

                    path = Path.resolve(basePath, attachment.name);
                }

                attachment.type = Utils.getAttachmentType(path);
                attachment.path = path;

                if (BotConfig.debug) {
                    console.log(`Attachment URL: ${attachment.url}`);
                    console.log(`Attachment path: ${attachment.path}`);
                }

                // Download the attachment
                try {
                    await Utils.downloadFromURL(attachment.url, attachment.path);
                    delete attachment.url;
                    downloadedAttachments.push(attachment);

                    // Add the file size to total bytes
                    totalBytes += FileSystem.statSync(attachment.path)['size'];
                } catch (error) {
                    console.log(`Failed to download attachment because: ${error.message}`.red);
                }
            });

            if (BotConfig.debug)
                console.log(`Downloaded `.green + `${downloadedAttachments.length}`.cyan + ` attachments`.green);
        }

        try {
            if (BotConfig.debug)
                console.log(`Saving the message to the databse ...`.cyan);

            // Save the message to the database
            const messageDbObject = new Message();
            messageDbObject.authorId = authorId;
            messageDbObject.authorName = authorName;
            messageDbObject.timestamp = messageObject.createdTimestamp;
            messageDbObject.channelName = messageObject.channel.name;
            messageDbObject.message = content;
            messageDbObject.attachments = downloadedAttachments;
            await messageDbObject.save();

            // Replicate the message on the remote server if it is enabled
            ReplicationManager.replicateMessage(messageDbObject);

            if (BotConfig.debug)
                console.log(`Message saved!`.cyan);

            // Update the statistics

            if (BotConfig.debug)
                console.log(`Updating the statistics ...`.cyan);

            let statistics = await Statistics.findOne({});

            if (!statistics) {
                statistics = new Statistics();
                statistics.messages = 1;
                statistics.attachments = downloadedAttachments.length;

                console.log(`Pushed into channels initial: ${messageObject.channel.name}`);
                const channelsArray = new Array();
                channelsArray.push(messageObject.channel.name);

                statistics.channels = channelsArray;
                statistics.totalBytes = totalBytes;
            } else {
                if (!statistics.channels.includes(messageObject.channel.name)) {
                    statistics.channels.push(messageObject.channel.name);
                    console.log(`Pushed into channels: ${messageObject.channel.name}`)
                }

                statistics.messages++;
                statistics.attachments += downloadedAttachments.length;
                statistics.totalBytes += totalBytes;
            }

            await statistics.save();

            if (BotConfig.debug)
                console.log(`Statistics updated!`.cyan);
        } catch (e) {
            console.log('Error while saving the message: ' + e.message);
        } finally {
            if (BotConfig.debug)
                console.log(`----------------------------------------------[ DEBUG ]----------------------------------------------`.cyan);
        }
    }

    static async updateMessage(client, oldMessageObject, newMessageObject) {
        if (!newMessageObject.content.trim())
            return;

        let oldMessageContent = Utils.getMessageFormatedContent(oldMessageObject);

        if (BotConfig.debug && oldMessageContent && oldMessageContent.length)
            console.log(`Old message content after formatting: [${oldMessageContent}]`.green);

        // Extract message author information
        const authorId = oldMessageObject.author.id;

        const archivedMessage = await Message.findOne({
            authorId,
            timestamp: oldMessageObject.createdTimestamp,
            message: oldMessageContent
        });

        if (!archivedMessage)
            return;

        let newMessageContent = Utils.getMessageFormatedContent(newMessageObject);

        if (BotConfig.debug && newMessageContent && newMessageContent.length)
            console.log(`New message content after formatting: [${newMessageContent}]`.green);

        archivedMessage.message = newMessageContent;
        archivedMessage.pinned = newMessageObject.pinned;
        await archivedMessage.save();

        if (BotConfig.debug)
            console.log(`Message updated in the archive!`.magenta);
    }

    static async updateMessagesChannel(oldChannelName, newChannelName) {
        const result = await Message.updateMany({ channelName: oldChannelName }, { $set: { channelName: newChannelName } });

        if (!result)
            return;

        if (BotConfig.debug)
            console.log(`${'Updated'.green} ${result.nModified.toString().cyan} ${'messages channel'.green}`);
    }
}

module.exports = MessageManager;