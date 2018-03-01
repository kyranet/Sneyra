const klasa = require('klasa');
const Music = require('./lib/Music');
const config = require('./config.json');

klasa.Client.defaultPermissionLevels
    .add(5, (client, msg) => msg.member && msg.guild.configs.dj && msg.member.roles.has(msg.guild.configs.dj), { fetch: true })
    .add(6, (client, msg) => msg.member &&
        ((msg.guild.configs.administrator && msg.member.roles.has(msg.guild.configs.administrator)) ||
            msg.member.permissions.has('MANAGE_GUILD')), { fetch: true });

class Sneyra extends klasa.Client {

    constructor() {
        super({
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
            cmdEditing: true,
            console: { useColor: true },
            pieceDefaults: { commands: { deletable: true } },
            prefix: 'm!',
            regexPrefix: /^(hey )?sneyra(,|!)/i
        });

        this.queue = new Music();
    }

}

new Sneyra().login(config.token);
