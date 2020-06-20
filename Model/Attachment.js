// Local modules
const DB = require('../Managers/DBManager').mongoose;

// Create User schema
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

// Create User Model
const Attachment = DB.model('Attachment', attachmentSchema);

// Export the User model
module.exports = Attachment;