const AbstractCommand = require('./AbstractCommand');
const ConfigurationManager = require('../Managers/ConfigurationManager');
const Message = require('../Model/Message');
const Discord = require('discord.js');
const Utils = require('../Utils');
const TimestampToDate = require('timestamp-to-date');
const BotConfig = require('../BotConfig');

class RollbackCommand extends AbstractCommand {
    constructor() {
        super("arollback", "Restores channels and messages from the Archive or the specified channel");
    }

    async execute(messageObject, client) {
        if (!messageObject.member.hasPermission('ADMINISTRATOR')) {
            messageObject.channel.send(`${messageObject.author} - Only the Administrators can use this command!`);
            return;
        }

        const channel = messageObject.channel;
        const guild = messageObject.guild;
        const messageArguments = this.getCommandArguments(messageObject.content);
        let specifiedChannel;

        if (messageArguments.length === 1) {
            specifiedChannel = this.getChannelIdFromTag(messageArguments[0]);

            if (!specifiedChannel)
                specifiedChannel = messageArguments[0].replace(/#/g, '').trim();
            else specifiedChannel = await Utils.getChannelObjectById(guild, specifiedChannel);
        }

        let start = new Date();
        let hrstart = process.hrtime();
        let fails = 0;

        await ConfigurationManager.setProcess(true);

        try {
            // Retreive the cursor, so we can iterate trough the data base
            const cursor = Message.collection.find({ $query: {}, $orderby: { timestamp: -1 } }, { timeout: false });

            // Iterate trought the data base
            while (await cursor.hasNext()) {
                // Get the current message
                let currentDocument;
                let currentChannel;

                try {
                    currentDocument = await cursor.next();

                    // If the user has specified a channel to be restored
                    if (specifiedChannel) {
                        // Skip if the channel does not exist on the server, so only the name has been provided and the current message is not supposed to be in that channel
                        if (typeof specifiedChannel === 'string' && specifiedChannel !== currentDocument.channelName)
                            continue;
                        // Skip if the channel does exist on the server and the current message is not supposed to be in that channel
                        else if (typeof specifiedChannel === 'object' && specifiedChannel.name !== currentDocument.channelName)
                            continue;
                    }

                    // Check if the channel where the message needs to be sent does exist, if it does not, create it
                    if (!(await Utils.doesChannelExist(guild, currentDocument.channelName)))
                        currentChannel = await guild.createChannel(currentDocument.channelName, { type: 'text' });
                    else currentChannel = await Utils.getChannelObjectByName(guild, currentDocument.channelName);

                    // Skip if for some reason channel is not a valid one!
                    if (!currentChannel || currentChannel === -1) {
                        fails++;
                        continue;
                    }

                    // Get the paths to the attachments
                    let attachments = currentDocument.attachments.map(attachment => attachment.path);

                    // Format the message
                    const formattedMessage = currentDocument.message.replace(/@/g, '(@)');
                    let message = `User: ${currentDocument.authorName}\nTime: ${TimestampToDate(currentDocument.timestamp, 'yyyy-MM-dd HH:mm:ss')}\n\nContent:\n${formattedMessage}`;
                    message = message.concat('\n-------------------------------------------------');

                    // Store the remainding part of the message into a separate variable and send it after the first part has been sent
                    let secondMessage = message.substr(2000, message.length);

                    // Limit the first message to 2000 characters
                    message = message.substr(0, 2000);

                    // If we have a message which is shorter than 2000 characters and we have attachments, send the message and the attachments, otherwise just send the message
                    if (attachments.length && !secondMessage.length)
                        await currentChannel.send(message, { files: attachments });
                    else await currentChannel.send(message);

                    // Send the remainding part of the message
                    if (secondMessage.length) {
                        // Check if we have attachments which we need to send, if we do have them send them with the second part of the message
                        if (attachments.length)
                            await currentChannel.send(secondMessage, { files: attachments });
                        else await currentChannel.send(secondMessage);
                    }
                } catch (error) {
                    fails++;
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            // Allow users to send messages again
            await ConfigurationManager.setProcess(false);

            let end = new Date() - start;
            let hrend = process.hrtime(hrstart);

            if (BotConfig.debug) {
                console.log('Execution time: %dms'.magenta, end);
                console.log('Execution time (hr): %ds %dms\nFails: %d'.magenta, hrend[0], hrend[1] / 1000000, fails);
            }

            // Send the success message
            if (fails)
                channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The rollback has been finished\nIt took me **${hrend[0]}** s to do it.\n**${fails}** messages failed to be restored.`));
            else channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The rollback has been finished\nIt took me **${hrend[0]}** s to do it.`));
        }
    }
}

module.exports = RollbackCommand;