const AbstractCommand = require('./AbstractCommand');
const ConfigurationManager = require('../Managers/ConfigurationManager');

class ConfigCommand extends AbstractCommand {
    constructor() {
        super("aconfig", "Configuration command");
    }

    async execute(messageObject, client) {
        if (!messageObject.member.hasPermission('ADMINISTRATOR')) {
            messageObject.channel.send(`${messageObject.author} - Only the Administrators can use this command!`);
            return;
        }

        let messageArguments = this.getCommandArguments(messageObject.content);

        if (messageArguments.length !== 2) {
            messageObject.channel.send(`${messageObject.author} - Insufficent number of arguments!\nUsage: !aconfig <stats-command | update-messages | archiving | blacklist-channel> <value>\nType !ahelp for more info.`);
            return;
        }

        const key = messageArguments[0].toLowerCase();

        if (!(key === 'stats-command' || key === 'update-messages' || key === 'archiving' || key === 'blacklist-channel')) {
            messageObject.channel.send(`${messageObject.author} - Invalid key name ${key}!\nAvaliable keys: stats-command | update-messages | archiving | blacklist-channel`);
            return;
        }

        let value = messageArguments[1].toLowerCase();

        if (key !== 'blacklist-channel') {
            if (!(value === 'enable' || value === 'disable')) {
                messageObject.channel.send(`${messageObject.author} - Invalid value (2nd argument)!\nAvaliable values: enable | disable`);
                return;
            }
        } else {
            value = this.getChannelIdFromTag(value);

            if (!value) {
                messageObject.channel.send(`${messageObject.author} - Invalid channel provided!`);
                return;
            }
        }

        switch (key) {
            case 'stats-command':
                await ConfigurationManager.setStatsCommand(value === 'enable' ? true : false);
                break;

            case 'update-messages':
                await ConfigurationManager.setMessageUpdate(value === 'enable' ? true : false);
                break;

            case 'archiving':
                await ConfigurationManager.setArchiving(value === 'enable' ? true : false);
                break;

            case 'blacklist-channel':
                if (await ConfigurationManager.isChannelBlacklisted(value)) {
                    await ConfigurationManager.removeBlacklistedChannel(value);
                    messageObject.channel.send(`${messageObject.author} - Channel <#${value}> has been removed from the blacklist!`);
                    return;
                }

                await ConfigurationManager.blacklistChannel(value);
                messageObject.channel.send(`${messageObject.author} - Channel <#${value}> has been blacklisted!`);
                break;
        }

        if (key !== 'blacklist-channel')
            messageObject.channel.send(`${messageObject.author} - Set ${key} to ${value}.`);
    }
}

module.exports = ConfigCommand;