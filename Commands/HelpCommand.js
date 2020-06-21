const AbstractCommand = require('./AbstractCommand');
const Discord = require('discord.js');
const ConfigurationManager = require('../Managers/ConfigurationManager');
const { version } = require('../package.json');

class HelpCommand extends AbstractCommand {
    constructor() {
        super("ahelp", "Displays the help");
    }

    async execute(messageObject, client) {
        let messageArguments = this.getCommandArguments(messageObject.content);

        let message = `Help for **Archiving Bot** (**v${version}**) made by **Dusan Milutinovic (milutinke)**
        Source code at Github: https://github.com/milutinke/Discord-Archive-Bot

        Commands:
        **!astats** - Shows the bot statistics for this server
        **!aconfig <key> <value>** - Configuration command for the bot (For detailed info use: **!ahelp config**)
        **!aprune** - Prunes (Deletes) the complete archive (including attachments)
        **!arollback <channel?>** - Rollbacks the entire archive or the specified channel (For detailed info use: **!ahelp rollback**)

        ***DISCLAMER: The following commands have not been implemented yet!***
        **!aexport <format>** - Exports the data to the specified format and sends you a link to download it
        **!aarchive <channel?>** - For detailed info use: **!ahelp archive**
        `;

        if (messageArguments[0]) {
            if (messageArguments[0] === 'config') {
                message = `**Configuration command help:**
                Description: Allows you to configure the Bot
                Usage: **!aconfig <key> <value>**

                Available configuration keys:
                **stats-command** - Enables/Disables the **!astats** command
                **update-messages** - Enables/Disables updating of the archive if the message is edited or pinned/unpinned
                **archiving** - Enables/Disabled archiving completely
                **blacklist-channel** - Blacklists a certain channel from being archived

                Available values for all keys except **blacklist-channel**:
                **enable**
                **disable**`;
            } else if (messageArguments[0] === 'rollback') {
                message = `**Rollback command help:**
                Description: Allows you to rollback the whole server, or the particular channel
                Usage: **!arollback <channel?>**

                **channel** is an optional field (indicated by **?**) - If the channel does not exists on the server, it will be crated if it exists in the archive
                `;
            } else message = `Unknown argument **${messageArguments[0]}**!`;
        }

        messageObject.channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(message));
    }
}

module.exports = HelpCommand;