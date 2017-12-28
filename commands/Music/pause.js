const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],

            description: 'Pauses the current song.'
        });

        this.requireMusic = true;
    }

    async run(msg) {
        const { music } = msg.guild;
        if (music.status === 'idle') throw 'The stream hasnt started yet.';
        if (music.status === 'paused') throw 'The stream is already paused.';

        music.pause();
        return msg.send('⏸ Paused');
    }

};
