const Configuration = require('../Model/Configuration');

class ConfigurationManager {
    static Cache = null;

    static async getConfiguration() {
        if (ConfigurationManager.Cache === null)
            ConfigurationManager.Cache = await Configuration.findOne({});

        if (!ConfigurationManager.Cache || ConfigurationManager.Cache.length === 0) {
            ConfigurationManager.Cache = new Configuration();
            ConfigurationManager.Cache = await ConfigurationManager.Cache.save();
        }

        return ConfigurationManager.Cache;
    }

    static async isStatsCommandEnabled() {
        return (await ConfigurationManager.getConfiguration()).statsCommandEnabled;
    }

    static async isMessageUpdateEnabled() {
        return (await ConfigurationManager.getConfiguration()).messageUpdateEnabled;
    }

    static async isArchivingEnabled() {
        return (await ConfigurationManager.getConfiguration()).archivingEnabled;
    }

    static async isProcessUnderway() {
        return (await ConfigurationManager.getConfiguration()).processUnderway;
    }

    static async isChannelBlacklisted(channelId) {
        const configuration = await ConfigurationManager.getConfiguration();
        const foundBlackListed = configuration.blacklistedChannels.filter(channel => channel.channelId === channelId);
        return foundBlackListed.length === 1;
    }

    static async setStatsCommand(value) {
        // Fetch the DB
        const configuration = await Configuration.findOne({});

        // Clear out the cache
        ConfigurationManager.Cache = null;

        // Update the DB and save
        configuration.statsCommandEnabled = value;
        await configuration.save();
    }

    static async setMessageUpdate(value) {
        // Fetch the DB
        const configuration = await Configuration.findOne({});

        // Clear out the cache
        ConfigurationManager.Cache = null;

        // Update the DB and save
        configuration.messageUpdateEnabled = value;
        await configuration.save();
    }

    static async setArchiving(value) {
        // Fetch the DB
        const configuration = await Configuration.findOne({});

        // Clear out the cache
        ConfigurationManager.Cache = null;

        // Update the DB and save
        configuration.archivingEnabled = value;
        await configuration.save();
    }

    static async setProcess(value) {
        // Fetch the DB
        const configuration = await Configuration.findOne({});

        // Clear out the cache
        ConfigurationManager.Cache = null;

        // Update the DB and save
        configuration.processUnderway = value;
        await configuration.save();
    }

    static async blacklistChannel(channelId) {
        // Fetch the DB
        const configuration = await Configuration.findOne({});

        // Clear out the cache
        ConfigurationManager.Cache = null;

        // Update the DB and save
        configuration.blacklistedChannels.push({ channelId });
        await configuration.save();
    }

    static async removeBlacklistedChannel(channelId) {
        // Fetch the DB
        const configuration = await Configuration.findOne({});

        // Clear out the cache
        ConfigurationManager.Cache = null;

        // Update the DB and save
        configuration.blacklistedChannels = configuration.blacklistedChannels.filter(channel => channel.channelId !== channelId);
        await configuration.save();
    }
}

module.exports = ConfigurationManager;