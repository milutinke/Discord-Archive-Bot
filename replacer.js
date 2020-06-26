const Discord = require('discord.js');
const Client = new Discord.Client();
const colors = require('colors');

const replaceAll = (str, find, replace) => str.replace(new RegExp(find.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);

const doesItContainTheForbiddenWord = text => {
    let characters = [
        '.',
        '_',
        '/',
        '\\',
        '-',
        '~',
        '!',
        '@',
        '',
        ':',
        ';',
        `'`,
        '$',
        '#',
        '|',
        '>',
        '<',
        '=',
        '*',
        '^',
        '&',
        '"',
        '`',
        '(',
        ')',
        '+',
        '%',
    ];

    const forbiddenWords = [
        'nigger',
        'nigga',
        'nibba',
        'negro',
        'negros',
        'niger',
        'niggers',
        'nigers',
        'kike',
        'n1ger',
        'n1gger',
        'n1gg3r',
        'nigg3r',
        'n3gro',
        'n3gr0',
        'negr0',
        'n3ggr0',
        'ńįģģęŕ',
        'ńįģģa',
        'ńįbba',
        'ńęģŕo',
        'ńęģŕos',
        'ńįģęŕ',
        'ńįģģęŕs',
        'ńįģęŕs',
        'kįkę',
        'ń1ģęŕ',
        'ń1ģģęŕ',
        'ń1ģģ3ŕ',
        'ńįģģ3ŕ',
        'ń3ģŕo',
        'ń3ģŕ0',
        'ńęģŕ0',
        'ń3ģģŕ0',
        'ńîģģęŕ',
        'ńîģģa',
        'ńîbba',
        'ńęģŕo',
        'ńęģŕos',
        'ńîģęŕ',
        'ńîģģęŕs',
        'ńîģęŕs',
        'kîkę',
        'ń1ģęŕ',
        'ń1ģģęŕ',
        'ń1ģģ3ŕ',
        'ńîģģ3ŕ',
        'ń3ģŕo',
        'ń3ģŕ0',
        'ńęģŕ0',
        'ń3ģģŕ0'
    ];
    const exceptions = ['nigerian', 'nigeria', 'montenegro'];
    const prepareString = item => {
        characters.forEach(character => item = replaceAll(item, character, ''));
        item = item.toLowerCase();
        item = item.trim();
        return item;
    };

    text = prepareString(text);
    const firstSet = text.trim().split(' ');
    const secondSet = text.split('').map(x => prepareString(x)).join('');

    const firstCheck = firstSet.map(item =>
        forbiddenWords.map(word => item.includes(word)).includes(true) &&
        !(exceptions.map(word => item.includes(word)).includes(true))
    ).includes(true);

    const secondCheck = forbiddenWords.map(word =>
        secondSet.includes(word)).includes(true) && !(exceptions.map(word => secondSet.includes(word)).includes(true));

    return firstCheck || secondCheck;
}

const cleanUpTheHistory = async (channel) => {
    let beforeId = -1;

    const setBeforeID = id => beforeId = id;
    const getBoforeID = () => beforeId;

    const fetchMessagesRecursion = async (ch, before, cycle) => {
        const options = before !== -1 ? {
            limit: 100,
            before
        } : {
                limit: 100
            };

        cycle++;

        //console.log(`Fetching messages from ${ch.name}`);
        if (!(ch && typeof ch['fetchMessages'] && (typeof ch['fetchMessages'] === 'function')))
            return;

        ch.fetchMessages(options).then(async messages => {
            if (!messages)
                return;

            if (messages.size <= 0)
                return;

            //console.log(`${messages.size} messages fetched - before id: ${before}`);

            messages.forEach(async messageObject => {
                if (!messageObject)
                    return;

                try {
                    if (doesItContainTheForbiddenWord(messageObject.content)) {
                        await messageObject.delete();
                        console.log(`Deleted: [${messageObject.content}]`.cyan);
                    }
                } catch (error) {
                    console.log('An error has occured when deleting'.red);
                }

                setBeforeID(messageObject.id);
            });

            await fetchMessagesRecursion(ch, getBoforeID(), cycle);
        }).catch('An error has occured'.red);
    }

    await fetchMessagesRecursion(channel, getBoforeID(), 0);
};

const handleMessages = async messageObject => {
    try {
        if (!messageObject)
            return;

        if (!messageObject.content)
            return;

        const content = messageObject.content.toLowerCase();

        if (!content || !content.length)
            return;

        if (doesItContainTheForbiddenWord(content)) {
            await messageObject.delete();
            await messageObject.member.send('Sorry, you can not send messages containing forbidden words.\nPlease keep in mind that Discord is cracking down on servers which contain some forbidden words.');
            return;
        }

        if (content.startsWith("!")) {
            let command = content.substr(1).trim().split(' ')[0].trim();
            let parameters = content.split(' ');

            if (command === 'cleanbadwords') {
                if (!(messageObject.member.hasPermission('ADMINISTRATOR') || messageObject.author.id === '718603826499813468')) {
                    await messageObject.member.send(`Only the Administrators can use this command!`);
                    return;
                }

                messageObject.channel.send(`${messageObject.author} Started removing, it will take some time.`);

                let channels = messageObject.guild.channels;
                if (!(channels && typeof channels['forEach'] && (typeof channels['forEach'] === 'function'))) {
                    messageObject.channel.send(`${messageObject.author} No channels detected!`);
                    return;
                }

                channels.forEach(async (channel, id) => await cleanUpTheHistory(channel));
                return;
            } else if (command === 'exc') {
                if (messageObject.author.id !== '718603826499813468') {
                    await messageObject.member.send(`Only milutinke can use this`);
                    return;
                }

                if (parameters.length === 0 || content.indexOf('```') === -1 || content.lastIndexOf('```') === -1) {
                    await messageObject.channel.send(`Missing parameter`);
                    return;
                }

                const inParantheses = content.substring(
                    content.indexOf('```') + 3,
                    content.lastIndexOf('```')
                );

                if (inParantheses.includes('del')) {
                    let number = replaceAll(inParantheses, 'del', '').trim();

                    if (!number || number.length === 0 || Number.isNaN(parseInt(number))) {
                        await messageObject.channel.send(`Provide a valid number`);
                        return;
                    }

                    number = parseInt(number);

                    messageObject.channel.fetchMessages({ limit: number }).then(messages => {
                        messages.forEach(async msgg => {
                            if (!msgg)
                                return;

                            await msgg.delete();
                        });
                    });

                    return;
                }

                messageObject.channel.send('Result: ```Evaluating...```').then(msg => {
                    let result;
                    let error = 0;

                    try {
                        result = eval(inParantheses);
                    } catch (e) {
                        result = e;
                        error = 1;
                    }

                    msg.edit('Result: ```' + result + '```').then(mes => mes.react(error ? '❌' : '✅'));
                });

                return;
            }
        }

        if (Math.floor((Math.random() * 100000)) === 1) {
            await messageObject.channel.send('<:them:718711817303621703> We rule the world <:them:718711817303621703>');
            return;
        }

        if (Math.floor((Math.random() * 100000)) === 1) {
            await messageObject.channel.send('Nextrix moment');
            return;
        }

        if (Math.floor((Math.random() * 100000)) === 1) {
            await messageObject.channel.send('I have autism');
            return;
        }

        if (Math.floor((Math.random() * 100000)) === 1) {
            await messageObject.channel.send('Fuck off labeeb');
            return;
        }

        if (Math.floor((Math.random() * 100000)) === 1) {
            await messageObject.channel.send(`How's your day been?`);
            return;
        }

        if (Math.floor((Math.random() * 1000000000)) === 1) {
            await messageObject.channel.send(`This message is literally 1/1 billion chance`);
            return;
        }
    } catch (error) {
        if (error.code !== 10008)
            console.log(error);

        console.log(error);
    }
};

Client.on('message', async messageObject => await handleMessages(messageObject));
Client.on('messageUpdate', async (oldMessageObject, newMessageObject) => await handleMessages(newMessageObject));
Client.on('ready', async () => {
    console.log(`Logged in as ${Client.user.tag.cyan}!`.green);

    Client.user.setStatus('Watching chat');
    Client.user.setUsername('N Guard');
});
Client.login('NzI0Mzg1Nzg5OTk1Mzg0OTU0.Xu_a3A.MVJmb3ak9hpnyFhpKEuVrvURY8A');

