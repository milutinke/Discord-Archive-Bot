const BotConfig = require('../BotConfig');
const Net = require('net');

class ReplicationManager {
    static async replicateMessage(message) {
        if (!BotConfig.replication_settings.replication_enabled)
            return;

        const socketClient = new Net.Socket();

        socketClient.connect({
            port: BotConfig.replication_settings.replacation_bot_port,
            host: BotConfig.replication_settings.replacation_bot_ip
        }, () => {
            const request = {
                secret: BotConfig.replication_settings.replacation_bot_secret_key,
                message
            };

            if (BotConfig.debug)
                console.log('Sent data to the replication bot, waiting response...'.green);

            socketClient.write(JSON.stringify(request));
        });

        socketClient.on('data', data => {
            const received = data.toString();

            if (received === 'BAD_SECRET')
                console.log(`Replication Bot Secret Key is invalid! Please check the configuration!`.bgRed.white);

            if (BotConfig.debug) {
                if (received === 'OK')
                    console.log('Replication Bot: Successfully replicated the message!'.green);
                else console.log('Replication Bot: Failed to replicate the message!'.red);
            }

            socketClient.end();
        });

        socketClient.on('error', error => {
            if (error.code === 'ECONNREFUSED')
                console.log('Failed to connect to the remote Replication Bot! Please check if the configuration is valid or if the bot is online!'.bgRed.white);
            else if (error.code === 'ETIMEDOUT ')
                console.log('Failed to connect to the remote Replication Bot! Most likely it is offline! Be sure to check your configuration!'.bgRed.white);
            else console.log(`Unknown error: ${error}`);
        });

        socketClient.on('end', () => { });
    }
}

module.exports = ReplicationManager;