// Modules
const Client = new (require('discord.js')).Client();
const BotConfig = require('./BotConfig');
const Colors = require('colors');

// Managers
const MessageManager = require('./Managers/MessageManager');
const CommandManager = require('./Managers/CommandManager');
const MemberManager = require('./Managers/MemberManager');
const ConfigurationManager = require('./Managers/ConfigurationManager');

// Initialisation
Client.on('ready', () => {
    console.log(`${'Logged in as'.green} ${Client.user.tag.toString().cyan}`);

    Client.user.setActivity('your messages', { type: 'WATCHING' });
});

// Message Handler
Client.on('message', async messageObject => {
    if (!messageObject)
        return;

    // Skip the bot
    if (messageObject.author.bot && messageObject.author.id === BotConfig.bot_client_id)
        return;

    if (await ConfigurationManager.isProcessUnderway()) {
        if (messageObject.member && !messageObject.author.bot)
            messageObject.member.send('Sorry, you can not send messages right now while the archive restoring process is underway, please be patient.');

        messageObject.delete(0);
        return;
    }

    // Archive the message
    if (await ConfigurationManager.isArchivingEnabled() && !(await ConfigurationManager.isChannelBlacklisted(messageObject.channel.id)))
        await MessageManager.archiveMessage(Client, messageObject);

    // Check if it is a command and execute it
    if (messageObject.content.trim().startsWith(BotConfig.bot_prefix)) {
        if (messageObject.author.bot)
            return;

        await CommandManager.executeCommand(messageObject, Client);
    }
});

// Check if the message needs to be updated
Client.on('messageUpdate', async (oldMessageObject, newMessageObject) => {
    if (!oldMessageObject || !newMessageObject)
        return;

    if (await ConfigurationManager.isArchivingEnabled() && await ConfigurationManager.isMessageUpdateEnabled())
        await MessageManager.updateMessage(Client, oldMessageObject, newMessageObject);
});

// If someone has changed the name of the channel, update the channel name in the archived messages
Client.on('channelUpdate', async (oldChannelObject, newChannelObject) => {
    if (!oldChannelObject || !newChannelObject)
        return;

    // Get the channel names
    const oldChannelName = oldChannelObject.name;
    const newChannelName = newChannelObject.name;

    // Skip if they are the same for some reason (just in case)
    if (oldChannelName === newChannelName)
        return;

    // Do the update
    if (await ConfigurationManager.isArchivingEnabled())
        await MessageManager.updateMessagesChannel(oldChannelName, newChannelName);
});

// If someone joins, record it
Client.on('guildMemberAdd', async member => {
    if (await ConfigurationManager.isArchivingEnabled())
        await MemberManager.memberJoinEvent(member);
});

// If someone updates their nickname
Client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (!oldMember || !newMember)
        return;

    // Get the channel names
    const oldNickname = oldMember.nickname;
    const newNickname = newMember.nickname;

    // Skip if the nicknames are not avaliable or if they are the same
    if (!oldNickname || !newNickname || oldNickname === newNickname)
        return;

    // Do the update
    if (await ConfigurationManager.isArchivingEnabled())
        await MemberManager.memberNicknameUpdateEvent(oldMember.id, oldNickname, newNickname);
});

// Bot Deinitialisation
Client.on("disconnected", async () => {
    await ConfigurationManager.setProcess(false);
    console.log('Disconnected'.red);
    process.exit(1);
});

// Bot Login
Client.login(BotConfig.bot_token);