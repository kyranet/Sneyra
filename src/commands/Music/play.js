const { MusicCommand, klasaUtil: { sleep } } = require('../../index');

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, { description: 'Let\'s start the queue!' });
	}

	async run(msg) {
		const { music } = msg.guild;

		if (!music.queue.length)
			return msg.sendMessage(`Add some songs to the queue first with ${msg.guild.configs.prefix}add`);

		if (!music.voiceChannel) await this.client.commands.get('join').run(msg);

		if (music.playing) {
			return msg.sendMessage('Already Playing');
		} else if (music.paused) {
			music.resume();
			return msg.sendMessage(`There was a track going on! Playing it back! Now playing: ${music.queue[0].title}!`);
		} else {
			music.channel = msg.channel;
			return this.play(music);
		}
	}

	async play(music) {
		while (music.queue.length) {
			const [song] = music.queue;
			await music.channel.send(`🎧 Playing: **${song.title}** as requested by: **${song.requester}**`);
			await sleep(300);

			try {
				await new Promise((resolve) => {
					music.play()
						.on('end', () => {
							music.skip();
							resolve();
						})
						.on('error', (err) => {
							music.channel.send('Something very weird happened! Sorry for the incovenience :(');
							music.client.emit('log', err, 'error');
							music.skip();
							resolve();
						});
				});

				// Autofetch if the autoplayer is enabled
				if (!music.queue.length && music.autoplay) await this.autoPlayer(music);
			} catch (error) {
				music.channel.send(error);
				music.leave();
				break;
			}

			// If the stream was externally stopped, for
			// example when Sneyra leaves,stop the loop
			if (!music.playing) return null;
		}

		return music.channel.send('⏹ Queue is empty').then(() => music.leave());
	}

	autoPlayer(music) {
		return music.add('YouTube AutoPlay', music.next);
	}

};
