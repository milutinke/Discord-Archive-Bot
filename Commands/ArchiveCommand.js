const AbstractCommand = require('./AbstractCommand');
const Discord = require('discord.js');
const Utils = require('../Utils');
const BotConfig = require('../BotConfig');
const Colors = require('colors');
const MessageManager = require('../Managers/MessageManager');

class ArchiveCommand extends AbstractCommand {
    static beforeId = -1;
    static archived = 0;
    static cached = new Array();

    constructor() {
        super("aarchive", "Archives the whole server or a specific channel");
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
                specifiedChannel = await Utils.getChannelObjectById(guild, messageArguments[0].replace(/#/g, '').trim());
            else specifiedChannel = await Utils.getChannelObjectById(guild, specifiedChannel);

            if (!specifiedChannel) {
                messageObject.channel.send(`${messageObject.author} - Could not find the requested channel!`);
                return;
            }
        }

        // Start tracking the exection time
        let start = new Date();
        let hrstart = process.hrtime();

        try {
            ArchiveCommand.archived = 0;
            ArchiveCommand.beforeId = -1;
            ArchiveCommand.cached = new Array();

            if (!specifiedChannel) {
                await messageObject.channel.send(`${messageObject.author} - Since the channel was not specified, performing an archiving of all channels!`);

                guild.channels.forEach(async channel => {
                    ArchiveCommand.beforeId = -1;
                    await ArchiveCommand.traverse(client, channel, ArchiveCommand.beforeId, 0);
                });
            } else {
                await messageObject.channel.send(`${messageObject.author} - Making an archive of channel ${specifiedChannel}!`);
                await ArchiveCommand.traverse(client, specifiedChannel, ArchiveCommand.beforeId, 0);
            }

            // Format and display the execution time
            let end = new Date() - start;
            let hrend = process.hrtime(hrstart);

            if (BotConfig.debug) {
                console.log('Execution time: %dms'.magenta, end);
                console.log('Execution time (hr): %ds %dms'.magenta, hrend[0], hrend[1] / 1000000);
            }

            // Send the success message
            await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The archiving has been completed!\nIt took me **${hrend[0]} seconds** to do it.`));
        } catch (error) {
            console.log(error);
            await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The archiving failed because of an error, please check out the command line!`));
        }
    }

    static async traverse(client, channel, before, cycle) {
        const options = before !== -1 ? {
            limit: 100,
            before
        } : {
                limit: 100
            };

        cycle++;

        if (BotConfig.debug)
            console.log(`Fetching from ${channel.name} ... Cycle: ${cycle}`.green);

        channel.fetchMessages(options).then(async messages => {
            if (!messages)
                return;

            if (messages.size <= 0)
                return;

            if (BotConfig.debug)
                console.log(`${messages.size.toString().cyan} ${'messages fetched from'.green} ${channel.name.cyan} - ${'Before id'.green}: ${before.toString().cyan}`.green);

            messages.forEach(async element => {
                if (!element || ArchiveCommand.isItCached(element)) {
                    ArchiveCommand.beforeId = element.id;
                    return;
                }

                ArchiveCommand.cached.push({
                    channel: element.channel.name,
                    timestamp: element.createdTimestamp,
                    author: element.author.id,
                    content: element.content
                });

                await MessageManager.archiveMessage(client, element);
                ArchiveCommand.beforeId = element.id;
                ArchiveCommand.archived++;
            });

            await ArchiveCommand.traverse(client, channel, ArchiveCommand.beforeId, cycle);
        }).catch(console.error);
    }

    static isItCached(messageObject) {
        return ArchiveCommand.cached.find(obj =>
            obj.channel === messageObject.channel.name
            && obj.timestamp === messageObject.createdTimestamp
            && obj.content === messageObject.content
            && obj.author === messageObject.author.id
        ) !== undefined;
    }
}


module.exports = ArchiveCommand;