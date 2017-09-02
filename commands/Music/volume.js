const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],
            aliases: ['vol'],

            usage: '[control:string]',
            description: 'Manage the volume for current song.',
            extendedHelp: [
                "Let's break it down!",
                '',
                "Listen carefully, you use this command by doing either 'volume ++++' or 'volume ----'.",
                "The more '+' you write, the more the volume will increment.",
                "The more '-' you write, the more the volume will decrease.",
                '',
                '👌'
            ].join('\n')
        });

        this.requireMusic = true;
    }

    async run(msg, [vol]) {
        const { dispatcher, status } = msg.guild.music;
        if (status !== 'playing') throw `I am not playing a song. Current status: \`${status}\``;

        if (!vol) return msg.send(`📢 Volume: ${Math.round(dispatcher.volume * 50)}%`);
        if (/^[+]+$/.test(vol)) {
            if (Math.round(dispatcher.volume * 50) >= 100) return msg.send(`📢 Volume: ${Math.round(dispatcher.volume * 50)}%`);
            dispatcher.setVolume(Math.min(((dispatcher.volume * 50) + (2 * (vol.split('+').length - 1))) / 50, 2));
            return msg.send(`${dispatcher.volume === 2 ? '📢' : '🔊'} Volume: ${Math.round(dispatcher.volume * 50)}%`);
        }

        if (/^[-]+$/.test(vol)) {
            if (Math.round(dispatcher.volume * 50) <= 0) return msg.send(`🔇 Volume: ${Math.round(dispatcher.volume * 50)}%`);
            dispatcher.setVolume(Math.max(((dispatcher.volume * 50) - (2 * (vol.split('-').length - 1))) / 50, 0));
            return msg.send(`${dispatcher.volume === 0 ? '🔇' : '🔉'} Volume: ${Math.round(dispatcher.volume * 50)}%`);
        }

        throw 'this is not how you use the volume command...';
    }

};
