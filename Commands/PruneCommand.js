const AbstractCommand = require('./AbstractCommand');
const Message = require('../Model/Message');
const Statistics = require('../Model/Statistics');
const Member = require('../Model/Member');
const BotConfig = require('../BotConfig');
const Path = require('path');
const FileSystem = require('fs');
const Del = require('del');

class PruneCommand extends AbstractCommand {
    constructor() {
        super("aprune", "Prunes the archive");
    }

    async execute(messageObject, client) {
        if (!messageObject.member.hasPermission('ADMINISTRATOR')) {
            messageObject.channel.send(`${messageObject.author} - Only the Administrators can use this command!`);
            return;
        }

        const sentMesageObject = await messageObject.channel.send(`${messageObject.author} - Do you really want to prune the archive?\nIf yes, react with ✅ to this message, otherwise react with ❌ to cancel.`);
        await sentMesageObject.react('✅');
        await sentMesageObject.react('❌');

        const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === messageObject.author.id;

        sentMesageObject.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(async collected => {
            const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
                // Delete the attachments
                const attachmentsPath = Path.resolve(process.cwd(), BotConfig.attachments_path);

                if (FileSystem.existsSync(attachmentsPath))
                    FileSystem.unlinkSync(attachmentsPath);

                // Delete from the database
                await Message.deleteMany({});
                await Statistics.deleteMany({});
                await Member.deleteMany({});

                messageObject.channel.send(`${messageObject.author} - Successfully pruned the archive from the database!`);
            } else messageObject.channel.send(`${messageObject.author} - You have successfully canceled the action!`);
        }).catch(collected => {
            console.log(collected);
            sentMesageObject.reply(`${messageObject.author} - Your action was canceled because you have not responded in time or an error has occured!`)
        });
    }
}

module.exports = PruneCommand;