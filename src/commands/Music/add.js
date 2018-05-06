const { MusicCommand, config: { GOOGLE_SEARCH } } = require('../../index');
const { get } = require('snekfetch');

const URL = 'https://www.googleapis.com/youtube/v3/search';

module.exports = class extends MusicCommand {

	constructor(...args) {
		super(...args, {
			description: 'Adds a song the the queue.',
			usage: '<url:string>'
		});
	}

	async run(msg, [url]) {
		const youtubeURL = await this.getURL(url);
		if (!youtubeURL) throw 'Not found.';

		const { music } = msg.guild;
		const song = await music.add(msg.author, youtubeURL);

		return msg.sendMessage(`🎵 Added **${song.title}** to the queue 🎶`);
	}

	async getURL(url) {
		const id = MusicCommand.YOUTUBE_REGEXP.exec(url);
		if (id) return `https://youtu.be/${id[1]}`;

		const { body } = await get(URL)
			.query('part', 'snippet')
			.query('q', url)
			.query('key', GOOGLE_SEARCH);

		const video = body.items.find(item => item.id.kind !== 'youtube#channel');
		return video ? `https://youtu.be/${video.id.videoId}` : null;
	}

};
