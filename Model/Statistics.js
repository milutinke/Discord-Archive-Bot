// Local modules
const DB = require('../Managers/DBManager').mongoose;

// Create User schema
const statisticsSchema = new DB.Schema({
    messages: {
        type: Number,
        required: true
    },

    attachments: {
        type: Number,
        required: true
    },

    totalBytes: {
        type: Number,
        required: true
    }
});

// Create User Model
const Statistics = DB.model('Statistics', statisticsSchema);

// Export the User model
module.exports = Statistics;