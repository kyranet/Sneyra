const { Client } = require('klasa');
const config = require('../config.js');

// Load custom structures
require('./lib/extensions/SneyraGuild');

// Modify the permission levels
Client.defaultPermissionLevels
	.add(5, (client, msg) => msg.member && msg.guild.configs.dj && msg.member.roles.has(msg.guild.configs.dj), { fetch: true })
	.add(6, (client, msg) => msg.member
        && ((msg.guild.configs.administrator && msg.member.roles.has(msg.guild.configs.administrator))
            || msg.member.permissions.has('MANAGE_GUILD')), { fetch: true });

new Client({
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
	commandEditing: true,
	console: { useColor: true, utc: true },
	pieceDefaults: { commands: { deletable: true, promptLimit: 5, quotedStringSupport: true } },
	prefix: 'm!',
	presence: { activity: { name: 'Sneyra, help', type: 'LISTENING' } },
	regexPrefix: /^(hey )?sneyra(,|!)/i
}).login(config.token);
