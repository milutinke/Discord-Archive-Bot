// Local modules
const DB = require('../Managers/DBManager').mongoose;

// Create Member schema
const memberSchema = new DB.Schema({
    memberId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    namesHistory: [{
        newName: {
            type: String,
            required: true
        },

        oldName: {
            type: String,
            required: true
        },

        changeTimestamp: {
            type: String,
            required: true
        }
    }],

    joinTimestamp: {
        type: String,
        required: true
    },

    numberOfReenties: {
        type: Number,
        default: 0
    }
});

// Create Member Model
const Member = DB.model('Member', memberSchema);

// Export the Member model
module.exports = Member;