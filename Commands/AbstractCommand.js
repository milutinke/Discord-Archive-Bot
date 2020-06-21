const BotConfig = require('../BotConfig');

class AbstractCommand {
	constructor(name, description) {
		this.name = name;
		this.description = description;
	}

	getCommandArguments(message, delimiter = " ") {
		const fullCommandName = BotConfig.bot_prefix + this.name;

		let messageArguments = message.trim().substr(message.lastIndexOf(fullCommandName) + fullCommandName.length, message.length).trim().split(delimiter);
		messageArguments = messageArguments.map(content => content.trim());
		messageArguments = messageArguments.filter(content => content === ' ' || content === '' ? false : true);

		return messageArguments;
	}

	getUserFromMention(client, text) {
		const matches = text.match(/^<@!?(\d+)>$/);

		if (!matches)
			return undefined;

		return client.users.get(matches[1]);
	}

	getChannelIdFromTag(text) {
		const matches = text.match(/^<#?(\d+)>$/);

		if (!matches)
			return undefined;

		return matches[0].toString().replace(/</g, '').replace(/>/g, '').replace(/#/g, '').trim();
	}
}

module.exports = AbstractCommand;