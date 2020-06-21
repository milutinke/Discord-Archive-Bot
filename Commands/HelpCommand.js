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

        let message = `Help for **Archiving Bot** (**v${version}**) made by **Dusan Milutinovic**
        Github: https://github.com/milutinke/Discord-Archive-Bot

        Commands:
        **!astats** - Shows the bot statistics for this server
        **!aconfig <key> <value>** - Configuration command for the bot (For detailed info use: **!ahelp config**)

        ***DISCLAMER: The following commands have not been implemented yet!***
        **!aexport <format>** - Exports the data to the specified format and sends you a link to download it
        **!aprune** - Prunes (Deletes) the complete archive (including attachments)
        **!aarchive <channel?>** - For detailed info use: **!ahelp archive**
        **!arollback <channel?>** - Rollbacks the entire archive or the specified channel (For detailed info use: **!ahelp rollback**)
        `;

        if (messageArguments[0] === 'config') {
            message = `**Configuration command help:**
            Usage: **!aconfig <key> <value>**

            Available configuration keys:
            **stats-command** - Enables/Disables the **!astats** command
            **update-messages** - Enables/Disables updating of the archive if the message is edited or pinned/unpinned
            **archiving** - Enables/Disabled archiving completely
            **blacklist-channel** - Blacklists a certain channel from being archived

            Available values for all keys except **blacklist-channel**:
            **enable**
            **disable**`;
        }

        messageObject.channel.send(new Discord.RichEmbed().setColor([0, 255, 255]).setDescription(message));
    }
}

module.exports = HelpCommand;