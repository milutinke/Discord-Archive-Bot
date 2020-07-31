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

        // Start tracking the exection time
        let start = new Date();
        let hrstart = process.hrtime();
        let fails = 0;
        let pinFailed = 0;

        // Stop users from sending the messages during the rollback
        await ConfigurationManager.setProcess(true);

        try {
            // Retreive the messages and sort them (This might be a really expensive operation if there is a lot of data, but I do not know how to sort data which is being iterated by a cursor efficently)
            // TODO: Optimize if possible
            // Note: If someone knows how to sort data iterated by cursor, plase do it
            const fetchedMessages = await Message.collection.find({}, { timeout: false }).sort({ timestamp: 1 }).toArray();

            await Utils.asyncForEach(fetchedMessages, async currentDocument => {
                try {
                    let currentChannel;

                    if (specifiedChannel) {
                        // Skip if the channel does not exist on the server, so only the name has been provided and the current message is not supposed to be in that channel
                        if (typeof specifiedChannel === 'string' && specifiedChannel !== currentDocument.channelName)
                            return;
                        // Skip if the channel does exist on the server and the current message is not supposed to be in that channel
                        else if (typeof specifiedChannel === 'object' && specifiedChannel.name !== currentDocument.channelName)
                            return;
                    }

                    // Check if the channel where the message needs to be sent does exist, if it does not, create it
                    if (!(await Utils.doesChannelExist(guild, currentDocument.channelName)))
                        currentChannel = await guild.createChannel(currentDocument.channelName, { type: 'text' });
                    else currentChannel = await Utils.getChannelObjectByName(guild, currentDocument.channelName);

                    // Skip if for some reason channel is not a valid one!
                    if (!currentChannel || currentChannel === -1) {
                        fails++;
                        return;
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

                    let sentMessage;
                    // If we have a message which is shorter than 2000 characters and we have attachments, send the message and the attachments, otherwise just send the message
                    if (attachments.length && !secondMessage.length)
                        sentMessage = await currentChannel.send(message, { files: attachments });
                    else sentMessage = await currentChannel.send(message);

                    // Send the remainding part of the message
                    if (secondMessage.length) {
                        // Check if we have attachments which we need to send, if we do have them send them with the second part of the message
                        if (attachments.length)
                            sentMessage = await currentChannel.send(secondMessage, { files: attachments });
                        else sentMessage = await currentChannel.send(secondMessage);
                    }

                    if (currentDocument.pinned)
                        await sentMessage.pin();
                } catch (error) {
                    // Skip the PIN error
                    if (!(error.code && error.code === 30003)) {
                        fails++;
                        console.log(error);
                    } else {
                        pinFailed++;
                    }
                }
            });

            // Allow users to send messages again
            await ConfigurationManager.setProcess(false);

            // Format and display the execution time
            let end = new Date() - start;
            let hrend = process.hrtime(hrstart);

            if (BotConfig.debug) {
                console.log('Execution time: %dms'.magenta, end);
                console.log('Execution time (hr): %ds %dms\nFails: %d'.magenta, hrend[0], hrend[1] / 1000000, fails);
            }

            // Send the success message
            if (fails)
                await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The rollback has been finished!\nIt took me **${hrend[0]} seconds** to do it.\n**${fails}** messages failed to be restored.`));
            else await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The rollback has been finished!\nIt took me **${hrend[0]} seconds** to do it.`));

            if (pinFailed > 0)
                await channel.send(`${pinFailed} messages have not been pinned because the limit was reached`);
        } catch (error) {
            console.log(error);
            await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The rollback failed because of an error, please check out the command line!`));
        }
    }
}

module.exports = RollbackCommand;