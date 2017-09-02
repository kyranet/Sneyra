const { Command } = require('klasa');
const { showSeconds } = require('../../lib/utils');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],

            description: 'Check the queue list.'
        });
    }

    async run(msg) {
        const { next, queue, autoplay } = msg.guild.music;
        const output = [];
        for (let i = 0; i < Math.min(queue.length, 10); i++) {
            output[i] = [
                `**TITLE**: ${queue[i].title}`,
                `**URL**: <${queue[i].url}> (${showSeconds(queue[i].seconds * 1000)})`,
                `**REQUESTER**: ${queue[i].requester.tag || queue[i].requester}`
            ].join('\n');
        }
        if (queue.length > 10) output.push(`\nShowing 10 songs of ${queue.length}`);
        else if (autoplay) output.push(`\n**AutoPlay**: <${next}>`);

        return msg.send(output.join(`\n\\🎵${'='.repeat(10)}\\🎵\n`));
    }

};
