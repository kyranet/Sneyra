const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],

            usage: '<number:integer>',
            description: 'Remove a song from the queue list.'
        });

        this.requireMusic = true;
    }

    async run(msg, [number]) {
        if (number <= 0) throw 'Invalid index.';
        number--;

        const { music } = msg.guild;
        if (music.queue.length < number) throw `You went out of range, the queue has ${music.queue.length}.`;

        const song = music.queue[number];
        if (song.requester.id !== msg.author.id) {
            const hasPermission = await msg.hasAtLeastPermissionLevel(5);
            if (hasPermission === false) throw 'You can\'t execute this command with the force flag. You must be at least a Dj Member.';
        }

        music.queue.splice(number, 1);
        return msg.send(`🗑 Removed the song **${song.title}** requested by **${song.requester}**.`);
    }

};
