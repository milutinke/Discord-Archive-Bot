const AbstractCommand = require('./AbstractCommand');
const Statistics = require('../Model/Statistics');
const BotConfig = require('../BotConfig');
const Discord = require('discord.js');
const PrettySize = require('prettysize');
const ConfigurationManager = require('../Managers/ConfigurationManager');

class StatsCommand extends AbstractCommand {
    constructor() {
        super("astats", "Displays the bot statistics");
    }

    async execute(messageObject, client) {
        let statistics = await Statistics.findOne({});

        if (!(await ConfigurationManager.isStatsCommandEnabled())) {
            messageObject.channel.send("This command has been disabled by the server saff!");
            return;
        }

        if (!statistics) {
            messageObject.channel.send("No statistics yet!");
            return;
        }

        let message = `Archiving Bot Statistics:\n\nTotal archives messages: ${statistics.messages}\nTotal archived attachments: ${statistics.attachments}\nTotal bandwith: ${PrettySize(statistics.totalBytes)}`;
        messageObject.channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(message));
    }
}

module.exports = StatsCommand;