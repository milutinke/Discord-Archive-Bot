// Modules
const Client = new (require('discord.js')).Client();
const BotConfig = require('./BotConfig');
const Colors = require('colors');

const MessageManager = require('./Managers/MessageManager');
const CommandManager = require('./Managers/CommandManager');

// Initialisation
Client.on('ready', () => console.log(`${'Logged in as'.green} ${Client.user.tag.toString().cyan}`));

// Commands Handler
Client.on('message', async messageObject => {
    if (!messageObject)
        return;

    // Archive the message
    await MessageManager.archiveMessage(Client, messageObject);

    // Check if it is a command and execute it
    if (messageObject.content.trim().startsWith(BotConfig.bot_prefix)) {
        if (messageObject.author.bot)
            return;

        CommandManager.executeCommand(messageObject, Client);
    }
});

// Bot Deinitialisation
Client.on("disconnected", () => {
    console.log('Disconnected'.red);
    process.exit(1);
});

// Bot Login
Client.login(BotConfig.bot_token);