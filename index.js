const klasa = require('komada');
const config = require('./config.json');

const client = new klasa.Client({
    prefix: 'm!',
    cmdPrompt: true,
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
    ]
});

client.login(config.token);
