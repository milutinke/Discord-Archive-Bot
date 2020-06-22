// Local modules
const DB = require('../Managers/DBManager').mongoose;

// Create Configuration schema
const configurationSchema = new DB.Schema({
    blacklistedChannels: [{
        channelId: {
            type: String,
            required: true
        }
    }],

    statsCommandEnabled: {
        type: Boolean,
        default: true
    },

    messageUpdateEnabled: {
        type: Boolean,
        default: true
    },

    archivingEnabled: {
        type: Boolean,
        default: true
    },

    processUnderway: {
        type: Boolean,
        default: false
    }
});

// Create Configuration Model
const Configuration = DB.model('Configuration', configurationSchema);

// Export the Configuration model
module.exports = Configuration;