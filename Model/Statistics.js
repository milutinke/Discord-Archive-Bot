// Local modules
const DB = require('../Managers/DBManager').mongoose;

// Create Statistics schema
const statisticsSchema = new DB.Schema({
    messages: {
        type: Number,
        required: true
    },

    attachments: {
        type: Number,
        required: true
    },

    channels: [String],

    totalBytes: {
        type: Number,
        required: true
    },

    totalMembersTracked: {
        type: Number
    }
});

// Create Statistics Model
const Statistics = DB.model('Statistics', statisticsSchema);

// Export the Statistics model
module.exports = Statistics;