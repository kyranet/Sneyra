const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],

            description: 'Prune the queue list.'
        });

        this.requireMusic = true;
    }

    async run(msg) {
        const { music } = msg.guild;

        if (music.voiceChannel.members.size > 4) {
            const hasPermission = await msg.hasAtLeastPermissionLevel(5);
            if (hasPermission === false) throw 'You can\'t execute this command when there are over 4 members. You must be at least a Dj Member.';
        }

        music.prune();
        return msg.send(`🗑 Pruned ${music.queue.length}`);
    }

};
