const TimestampToDate = require('timestamp-to-date');
const BotConfig = require('../BotConfig');
const Colors = require('colors');
const FileSystem = require('fs');
const Path = require('path');
const { isRegExp } = require('util');
const { Util } = require('discord.js');
const Utils = require('../Utils');

// HACK: Private fields using Symbold
const Format = Symbol();
const Initialise = Symbol();
const Handle = Symbol();
const EPath = Symbol();
const EName = Symbol();
const EAttachmentsPath = Symbol();
const JSON_Data = Symbol();

class ExportManager {
    static supportedFormats = ["Word", "Text", "HTML", "JSON"];

    constructor(format) {
        this[Format] = format;

        // Initialise the export
        this[Initialise]();
    }

    [Initialise]() {
        const exportsPath = Path.resolve(process.cwd(), 'Exports');

        if (!FileSystem.existsSync(exportsPath))
            FileSystem.mkdirSync(exportsPath);

        const exportName = TimestampToDate(Date.now(), 'Export-MM-dd-HH-mm');
        const currentExportPath = Path.resolve(exportsPath, exportName);

        if (!FileSystem.existsSync(currentExportPath))
            FileSystem.mkdirSync(currentExportPath);

        this[EName] = exportName;
        this[EPath] = currentExportPath;

        const attachmentsPath = Path.resolve(currentExportPath, 'Attachments');

        if (!FileSystem.existsSync(attachmentsPath))
            FileSystem.mkdirSync(attachmentsPath);

        this[EAttachmentsPath] = attachmentsPath;

        switch (this[Format]) {
            case 'JSON':
                this[Handle] = FileSystem.createWriteStream(Path.join(currentExportPath, 'Archive.json'));
                this[JSON_Data] = new Array();
                break;
        }
    }

    async exportMessage(message) {
        if (BotConfig.debug)
            console.log(`${'Exporting the message:'.cyan}\n${JSON.stringify(message, null, 2).green}\n---------------------------`);

        if (message.attachments && message.attachments.length > 0) {
            message.attachments.forEach(attachment => {
                if (FileSystem.existsSync(attachment.path)) {
                    FileSystem.copyFileSync(Path.resolve(this[EAttachmentsPath], attachment.name), attachment.path);
                    attachment.path = Path.resolve(this[EName], 'Attachments', attachment.name);
                }
            });
        }

        switch (this[Format]) {
            case 'JSON':
                this[JSON_Data].push(message);
                break;
        }
    }

    async finish() {
        switch (this[Format]) {
            case 'JSON':
                this[Handle].end();
                break;
        }

        // Zip the directory
        const zipPath = `${this[EPath]}.zip`.trim();

        if (FileSystem.existsSync(this[EPath]))
            await Utils.zipDirectory(this[EPath], zipPath);

        // Delete the temporary folder
        if (FileSystem.existsSync(this[EPath]))
            FileSystem.rmdirSync(this[EPath]);

        // TODO: Return the link
        return "http://dummy.link.com/";
    }
}

module.exports = ExportManager;