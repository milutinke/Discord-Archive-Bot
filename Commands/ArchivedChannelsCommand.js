const AbstractCommand = require('./AbstractCommand');
const Message = require('../Model/Message');
const Discord = require('discord.js');

class ArchivedChannelsCommand extends AbstractCommand {
    constructor() {
        super("achannels", "Displays the list of archived channels");
    }

    async execute(messageObject, client) {
        const channel = messageObject.channel;

        try {
            let statistics = await Statistics.findOne({});

            if (!statistics || statistics.channels.length === 0) {
                channel.send(`${messageObject.author} - There are no archived channels!`);
                return;
            }

            const foundChannels = statistics.channels.sort();
            let message = "Archived channels:\n";

            foundChannels.forEach(channelName => message = message.concat(` - **${channelName}**\n`));
            message = message.concat(`\n\nThere is ${foundChannels.length} channels in total!`);
            message = message.substr(0, 2000);

            channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(message));
        } catch (error) {
            console.log(error);
            channel.send(`${messageObject.author} - Sorry, there was an error, I could not execute the command!`);
        }
    }
}

module.exports = ArchivedChannelsCommand;