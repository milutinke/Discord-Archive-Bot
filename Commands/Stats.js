const AbstractCommand = require('./AbstractCommand');
const Statistics = require('../Model/Statistics');
const BotConfig = require('../BotConfig');
const Discord = require('discord.js');
const PrettySize = require('prettysize');

class Stats extends AbstractCommand {
    constructor() {
        super("stats", "Displays the bot statistics");
    }

    async execute(messageObject, client) {
        let statistics = await Statistics.findOne({});

        if (!statistics) {
            messageObject.channel.send("No statistics yet!");
            return;
        }

        let message = `Archiving Bot Statistics:\n\nTotal archives messages: ${statistics.messages}\nTotal archived attachments: ${statistics.attachments}\nTotal bandwith: ${PrettySize(statistics.totalBytes)}`;
        messageObject.channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(message));
    }
}

module.exports = Stats;