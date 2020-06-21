const AbstractCommand = require('./AbstractCommand');

class WipeCommand extends AbstractCommand {
    constructor() {
        super("awipe", "Deletes channels and roles from the server");
    }

    async execute(messageObject, client) {
        if (!messageObject.member.hasPermission('ADMINISTRATOR')) {
            messageObject.channel.send(`${messageObject.author} - Only the Administrators can use this command!`);
            return;
        }

        const sentMesageObject = await messageObject.channel.send(`${messageObject.author} - Do you really want to delete all channels and roles?\nIf yes, react with ✅ to this message, otherwise react with ❌ to cancel.`);
        await sentMesageObject.react('✅');
        await sentMesageObject.react('❌');

        const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === messageObject.author.id;

        sentMesageObject.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(async collected => {
            const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
                let guild = messageObject.guild;

                guild.channels.forEach(channel => channel.delete());
                const createdChannel = await guild.createChannel('general', { type: 'text' });
                createdChannel.send(`${messageObject.author} has wiped the server channels and roles!`);
            } else messageObject.channel.send(`${messageObject.author} - You have successfully canceled the action!`);
        }).catch(collected => {
            console.log(collected);
            sentMesageObject.reply(`${messageObject.author} - Your action was canceled because you have not responded in time or an error has occured!`)
        });
    }
}

module.exports = WipeCommand;