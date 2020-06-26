// Local modules
const DB = require('../Managers/DBManager').mongoose;

// Create Message schema
const messageSchema = new DB.Schema({
    authorId: {
        type: String,
        required: true
    },

    authorName: {
        type: String,
        required: true
    },

    timestamp: {
        type: String,
        required: true,
        index: true
    },

    channelName: {
        type: String,
        required: true
    },

    message: {
        type: String,
        default: ''
    },

    pinned: {
        type: Boolean,
        default: false
    },

    attachments: [{
        name: {
            type: String,
            required: true
        },

        path: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true
        }
    }]
});

// Create Message Model
const Message = DB.model('Message', messageSchema);

// Export the Message model
module.exports = Message;