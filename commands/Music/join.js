const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],
            aliases: ['connect'],

            description: 'Joins the message author\'s voice channel.'
        });
    }

    async run(msg) {
        if (!msg.member) await msg.guild.members.fetch(msg.author.id).catch(() => {
            throw 'I am sorry, but Discord did not tell me the information I need, so I do not know what voice channel are you connected to...';
        });
        const { voiceChannel } = msg.member;
        if (!voiceChannel) throw 'You are not connected in a voice channel.';
        this.resolvePermissions(msg, voiceChannel);

        const { music } = msg.guild;
        await music.join(voiceChannel);

        return msg.send(`Successfully joined the voice channel ${voiceChannel}`);
    }

    resolvePermissions(msg, voiceChannel) {
        const permissions = voiceChannel.permissionsFor(msg.guild.me);

        if (permissions.has('CONNECT') === false) throw 'I do not have enough permissions to connect to your voice channel. I am missing the CONNECT permission.';
        if (permissions.has('SPEAK') === false) throw 'I can connect... but not speak. Please turn on this permission so I can emit music.';
    }

};
