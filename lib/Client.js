const { Client, PermissionLevels } = require('klasa');
const Music = require('./Music');

const permissionLevels = new PermissionLevels()
    .addLevel(0, false, () => true)
    .addLevel(5, false, (client, msg) => msg.guild && msg.guild.configs.dj && msg.member.roles.has(msg.guild.configs.dj))
    .addLevel(6, false, (client, msg) => {
        if (!msg.guild) return false;
        if (msg.guild.configs.administrator) return msg.member.roles.has(msg.guild.configs.administrator);
        return msg.guild && msg.member.permissions.has('MANAGE_GUILD');
    })
    .addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
    .addLevel(9, true, (client, msg) => msg.author === client.owner)
    .addLevel(10, false, (client, msg) => msg.author === client.owner);

class Sneyra extends Client {

    constructor(options) {
        super(Object.assign(options, { permissionLevels }));

        this.queue = new Music();
    }

}

module.exports = Sneyra;
