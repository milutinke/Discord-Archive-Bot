const TimestampToDate = require('timestamp-to-date');
const BotConfig = require('../BotConfig');
const Colors = require('colors');

// HACK: Private fields using Symbold
const Format = Symbol();
const Initialise = Symbol();
const Handle = Symbol();

class ExportManager {
    static supportedFormats = ["Word", "Text", "HTML", "Json"];

    constructor(format) {
        this[Format] = format;

        // Initialise the export
        this[Initialise]();
    }

    [Initialise]() {
        switch (this[Format]) {

        }
    }

    async exportMessage(message) {
        if (BotConfig.debug)
            console.log(`${'Exporting the message:'.cyan}\n${JSON.stringify(message, null, 2).green}\n---------------------------`);

        switch (this[Format]) {

        }
    }

    async finish() {
        switch (this[Format]) {

        }
    }
}

module.exports = ExportManager;