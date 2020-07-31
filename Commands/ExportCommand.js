const AbstractCommand = require('./AbstractCommand');
const ExportManager = require('../Managers/ExportManager');
const Message = require('../Model/Message');
const Discord = require('discord.js');
const Utils = require('../Utils');
const BotConfig = require('../BotConfig');

class ExportCommand extends AbstractCommand {
    constructor() {
        super("aexport", "Exports the entire archive or a particular channel");
    }

    async execute(messageObject, client) {
        if (!messageObject.member.hasPermission('ADMINISTRATOR')) {
            messageObject.channel.send(`${messageObject.author} - Only the Administrators can use this command!`);
            return;
        }

        return await messageObject.channel.send(`${messageObject.author} - This command has not been implemented yet!`);

        /*
        const channel = messageObject.channel;
        const guild = messageObject.guild;
        const messageArguments = this.getCommandArguments(messageObject.content);

        let formmatedFormats = "";
        let specifiedChannel;
        let format;
        let link;

        // Format the available formates for the message
        for (let i = 0; i < ExportManager.supportedFormats.length; i++)
            formmatedFormats += i === 0 ? `${ExportManager.supportedFormats[i]}` : `, ${ExportManager.supportedFormats[i]}`;

        if (messageArguments.length === 0) {
            messageObject.channel.send(`${messageObject.author} - You must specify a format for export! [Avaliable formats: ${formmatedFormats}]`);
            return;
        }

        if (messageArguments.length >= 1 && !ExportManager.supportedFormats.map(format => format.toLowerCase()).includes(messageArguments[0].toLowerCase())) {
            messageObject.channel.send(`${messageObject.author} - Format "${messageArguments[0]}" is not a valid one! [Avaliable formats: ${formmatedFormats}]`);
            return;
        }

        if (messageArguments.length === 2) {
            specifiedChannel = this.getChannelIdFromTag(messageArguments[0]);

            if (!specifiedChannel)
                specifiedChannel = messageArguments[0].replace(/#/g, '').trim();
            else specifiedChannel = await Utils.getChannelObjectById(guild, specifiedChannel);
        }

        format = messageArguments[0];

        // Start tracking the exection time
        let start = new Date();
        let hrstart = process.hrtime();
        let fails = 0;

        try {
            // Retreive the messages and sort them (This might be a really expensive operation if there is a lot of data, but I do not know how to sort data which is being iterated by a cursor efficently)
            // TODO: Optimize if possible
            // Note: If someone knows how to sort data iterated by cursor, plase do it
            let fetchedMessages;

            if (specifiedChannel)
                fetchedMessages = await Message.collection.find({ channelName: specifiedChannel }, { timeout: false }).sort({ timestamp: 1 }).toArray();
            else fetchedMessages = await Message.collection.find({}, { timeout: false }).sort({ timestamp: 1 }).toArray();

            // Initialise the export manager
            const exportManager = new ExportManager(format);

            // Send the start message
            await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`I have found ${fetchedMessages.length} messages for the export. Started exporting ...`));

            // Begin the export
            await Utils.asyncForEach(fetchedMessages, async currentDocument => {
                try {
                    // Delete the unecessary data off the message object
                    delete currentDocument._id;
                    delete currentDocument.__v;

                    // Export the message
                    await exportManager.exportMessage(currentDocument);
                } catch (error) {
                    fails++;
                }
            });

            // Finalise the export
            link = await exportManager.finish();

            // Format and display the execution time
            let end = new Date() - start;
            let hrend = process.hrtime(hrstart);

            if (BotConfig.debug) {
                console.log('Execution time: %dms'.magenta, end);
                console.log('Execution time (hr): %ds %dms\nFails: %d'.magenta, hrend[0], hrend[1] / 1000000, fails);
            }

            // Send the success message
            if (fails)
                await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The export has been finished!\nIt took me **${hrend[0]} seconds** to do it.\n**${fails}** messages failed to be exported.`));
            else await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The export has been finished!\nIt took me **${hrend[0]} seconds** to do it.`));

            // TODO: Send the link to the DM
        } catch (error) {
            console.log(error);
            await channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(`The export has failed because of an error specified in the next Bot message!`));
            await channel.send('```' + error.substring(0, 2000) + '```');

            if (error.length > 2000)
                await channel.send('```' + error.substring(2000, error.length) + '```');
        }*/
    }
}

module.exports = ExportCommand;