const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, { runIn: ['text'] });

        this.requireMusic = true;
    }

    async run(msg) {
        const { music } = msg.guild;
        const enabled = music.autoplay === false;

        music.autoplay = enabled;

        return msg.send(`Dear ${msg.author}, YouTube AutoPlay has been ${enabled ? 'enabled' : 'disabled'}.`);
    }

};
