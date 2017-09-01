const Discord = require('discord.js');
const MusicManager = require('./MusicManager');

module.exports = class MusicInterface extends Discord.Collection {

    constructor(client) {
        super();

        Object.defineProperty(this, 'client', { value: client });
    }

    /**
     * Create a new interface.
     * @param {Discord.Guild} guild A Guild instance.
     * @returns {MusicManager}
     */
    create(guild) {
        if (guild.constructor.name !== 'Guild') throw 'The parameter \'Guild\' must be a guild instance.';
        const manager = new MusicManager(guild);
        super.set(guild.id, manager);
        return manager;
    }

};
