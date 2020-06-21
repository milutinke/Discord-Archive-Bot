// Local modules
const DB = require('../Managers/DBManager').mongoose;
const Attachment = require('./Attachment');

// Create User schema
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
        required: true
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

    attachments: [Attachment.schema]
});

// Create Message Model
const Message = DB.model('Message', messageSchema);

// Export the Message model
module.exports = Message;