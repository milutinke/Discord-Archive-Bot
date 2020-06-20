const Mongoose = require('mongoose');
const BotConfig = require('../BotConfig');
const Colors = require('colors');

class DataBaseManager {
    constructor() {
        Mongoose.Promise = require('bluebird');
        this.mongoose = Mongoose;

        this.url = `mongodb://${BotConfig.database.mongodb_user}:${BotConfig.database.mongodb_password}@${BotConfig.database.mongodb_host}:${BotConfig.database.mongodb_port}/${BotConfig.database.mongodb_base}?retryWrites=true&w=majority`;
        
        this.connection = Mongoose.connect(this.url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(() => {
            if (BotConfig.debug)
                console.log('DataBase Manager:'.cyan + ' Connected!'.green);
        }).catch(error => console.error(`${error}`.red));
    }
}

module.exports = new DataBaseManager();