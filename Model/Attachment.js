// Local modules
const DB = require('../Managers/DBManager').mongoose;

// Create Attachment schema
const attachmentSchema = new DB.Schema({
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
});

// Create Attachment Model
const Attachment = DB.model('Attachment', attachmentSchema);

// Export the Attachment model
module.exports = Attachment;