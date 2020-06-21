const AbstractCommand = require('./AbstractCommand');
const Message = require('../Model/Message');
const Discord = require('discord.js');

class ArchivedChannelsCommand extends AbstractCommand {
    constructor() {
        super("achannels", "Displays the list of archived channels");
    }

    async execute(messageObject, client) {
        const channel = messageObject.channel;
        let foundChannels = new Array();

        try {
            // Retreive the cursor, so we can iterate trough the data base
            const cursor = Message.collection.find({}, { timeout: false });

            // Iterate trought the data base
            while (await cursor.hasNext()) {
                try {
                    const currentDocument = await cursor.next();

                    if (!foundChannels.includes(currentDocument.channelName))
                        foundChannels.push(currentDocument.channelName);

                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
            channel.send(`${messageObject.author} - Sorry, there was an error, I could not execute the command!`);
        } finally {
            if (foundChannels.length) {
                foundChannels = foundChannels.sort();

                let message = "Archived channels:\n";
                foundChannels.forEach(channelName => message = message.concat(` - **${channelName}**\n`));
                message = message.concat(`\n\nThere is ${foundChannels.length} channels in total!`);
                message = message.substr(0, 2000);
                channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(message));
            } else channel.send(`${messageObject.author} - There are no archived channels!`);
        }
    }
}

module.exports = ArchivedChannelsCommand;