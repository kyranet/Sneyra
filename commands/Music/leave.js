const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],

            description: 'Leaves the voice channel.'
        });

        this.requireMusic = true;
    }

    async run(msg) {
        const { music } = msg.guild;
        await music.leave();

        return msg.send(`Successfully left the voice channel ${msg.member.voiceChannel}`);
    }

};
