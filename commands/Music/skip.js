const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],
            aliases: ['vol'],

            usage: '[-force]',
            description: 'Skip the current song.'
        });

        this.requireMusic = true;
    }

    async run(msg, [force]) {
        const { music } = msg.guild;

        if (music.voiceChannel.members.size > 4) {
            if (force) {
                const hasPermission = await msg.hasAtLeastPermissionLevel(5);
                if (hasPermission === false) throw 'You can\'t execute this command with the force flag. You must be at least a Moderator Member.';
            } else {
                const response = this.handleSkips(music, msg.author.id);
                if (response) return msg.send(response);
            }
        }

        await msg.send(`⏭ Skipped ${music.queue[0].title}`);
        music.skip(true);
        return null;
    }

    handleSkips(musicInterface, user) {
        if (!musicInterface.queue[0].skips) musicInterface.queue[0].skips = new Set();
        if (musicInterface.queue[0].skips.has(user)) return 'You have already voted to skip this song.';
        musicInterface.queue[0].skips.add(user);
        const members = musicInterface.voiceChannel.members.size - 1;
        return this.shouldInhibit(members, musicInterface.queue[0].skips.size);
    }

    shouldInhibit(total, size) {
        if (total <= 3) return true;
        return size >= total * 0.4 ? false : `🔸 | Votes: ${size} of ${Math.ceil(total * 0.4)}`;
    }

};
