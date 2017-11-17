const Client = require('./lib/Client');
const config = require('./config.json');

const Sneyra = new Client({
    prefix: 'm!',
    cmdEditing: true,
    disabledEvents: [
        'GUILD_BAN_ADD',
        'GUILD_BAN_REMOVE',
        'TYPING_START',
        'RELATIONSHIP_ADD',
        'RELATIONSHIP_REMOVE',
        'CHANNEL_PINS_UPDATE',
        'PRESENCE_UPDATE',
        'USER_UPDATE',
        'USER_NOTE_UPDATE',
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
        'MESSAGE_REACTION_REMOVE_ALL'
    ],
    console: { useColor: true }
});

Sneyra.login(config.token);
Sneyra.once('ready', () => {
    for (const guild of Sneyra.guilds.values()) Sneyra.queue.create(guild);
});
