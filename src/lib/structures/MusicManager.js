const { util: { codeBlock } } = require('klasa');
const ytdl = require('ytdl-core');
const getInfoAsync = require('util').promisify(ytdl.getInfo);

class MusicManager {

	/**
	 * @typedef {Object} MusicManagerSong
	 * @property {string} url The video id
	 * @property {string} title The title of the video
	 * @property {KlasaUser | string} user The user that requested this song
	 * @property {number} loudness The loudness for this song, reserved for future
	 * @property {number} seconds The seconds this video lasts
	 * @property {boolean} opus Whether this video has an Opus stream available or not
	 */

	constructor(guild) {
		/**
		 * The Client that manages this instance
		 * @since 1.0.0
		 * @type {Sneyra}
		 * @name MusicManager#client
		 */
		Object.defineProperty(this, 'client', { value: guild.client });

		/**
		 * The SneyraGuild instance that manages this instance
		 * @since 1.0.0
		 * @type {SneyraGuild}
		 * @name MusicManager#guild
		 */
		Object.defineProperty(this, 'guild', { value: guild });

		/**
		 * The ids of the 10 latest played videos
		 * @since 1.0.0
		 * @type {string[]}
		 */
		this.recentlyPlayed = [];

		/**
		 * The current queue for this manager
		 * @since 1.0.0
		 * @type {MusicManagerSong[]}
		 */
		this.queue = [];

		/**
		 * The Channel instance where music commands are played at
		 * @since 1.0.0
		 * @type {TextChannel}
		 */
		this.channel = null;

		/**
		 * Whether autoplayer is enabled or not
		 * @since 1.0.0
		 * @type {boolean}
		 */
		this.autoplay = false;

		/**
		 * The next song id for autoplayer
		 * @since 1.0.0
		 * @type {?string}
		 */
		this._next = null;
	}

	get remaining() {
		const { playing, dispatcher } = this;
		if (!playing) return null;
		const [song] = this.queue;
		return (song.seconds * 1000) - dispatcher.streamTime;
	}

	/**
	 * The next video
	 * @since 1.0.0
	 * @type {?string}
	 * @readonly
	 */
	get next() {
		return this._next ? `https://youtu.be/${this._next}` : null;
	}

	/**
	 * The VoiceChannel Sneyra is connected to
	 * @since 1.0.0
	 * @type {?VoiceChannel}
	 * @readonly
	 */
	get voiceChannel() {
		return this.guild.me.voiceChannel;
	}

	/**
	 * The VoiceChannel's connection
	 * @since 1.0.0
	 * @type {?VoiceConnection}
	 * @readonly
	 */
	get connection() {
		const { voiceChannel } = this;
		return (voiceChannel && voiceChannel.connection) || null;
	}

	/**
	 * The VoiceConnection's dispatcher
	 * @since 1.0.0
	 * @type {?StreamDispatcher}
	 * @readonly
	 */
	get dispatcher() {
		const { connection } = this;
		return (connection && connection.dispatcher) || null;
	}

	/**
	 * Whether Sneyra is playing a song or not
	 * @since 2.0.0
	 * @type {boolean}
	 * @readonly
	 */
	get playing() {
		const { connection } = this;
		return connection && connection.speaking;
	}

	/**
	 * Whether Sneyra has the queue paused or not
	 * @since 2.0.0
	 * @type {boolean}
	 * @readonly
	 */
	get paused() {
		const { connection } = this;
		const { dispatcher } = connection;
		return connection && !connection.speaking && dispatcher;
	}

	/**
	 * Whether Sneyra is doing nothing
	 * @since 2.0.0
	 * @type {boolean}
	 * @readonly
	 */
	get idling() {
		return !this.queue.length || !this.dispatcher;
	}

	/**
	 * Add a song to the queue
	 * @since 1.0.0
	 * @param {KlasaUser} user The user that requests this song
	 * @param {string} url The url to add
	 * @returns {MusicManagerSong}
	 */
	async add(user, url) {
		const song = await getInfoAsync(url).catch((err) => {
			this.client.emit('log', err, 'error');
			throw `Something happened with YouTube URL: ${url}\n${codeBlock('', err)}`;
		});

		const metadata = {
			url: song.video_id,
			title: song.title,
			requester: user,
			loudness: song.loudness,
			seconds: parseInt(song.length_seconds),
			opus: song.formats.some(format => format.type === 'audio/webm; codecs="opus"')
		};

		this.queue.push(metadata);
		this._next = this.getLink(song.related_videos);

		return metadata;
	}

	/**
	 * Get a link from a playlist, filtering previously played videos
	 * @since 1.0.0
	 * @param {Array<Object<*>>} playlist The playlist to check
	 * @returns {?string}
	 */
	getLink(playlist) {
		for (const song of playlist) {
			if (!song.id || this.recentlyPlayed.includes(song.id)) continue;
			return song.id;
		}
		return null;
	}

	/**
	 * Join a voice channel, handling ECONNRESETs
	 * @since 1.0.0
	 * @param {VoiceChannel} voiceChannel Join a voice channel
	 * @returns {Promise<VoiceConnection>}
	 */
	join(voiceChannel) {
		return voiceChannel.join().catch((err) => {
			if (String(err).includes('ECONNRESET')) throw 'There was an issue connecting to the voice channel, please try again.';
			this.client.emit('error', err);
			throw err;
		});
	}

	/**
	 * Leave the voice channel, reseating all the current data
	 * @since 1.0.0
	 * @returns {Promise<this>}
	 */
	async leave() {
		if (!this.voiceChannel) throw 'I am not in a voice channel.';
		await this.voiceChannel.leave();

		// Reset the status
		return this.clear();
	}

	play() {
		if (!this.voiceChannel) throw 'I am not in a voice channel.';
		else if (!this.connection) throw 'I could not find a connection.';
		else if (this.queue.length === 0) throw 'The queue is empty.';

		const song = this.queue[0];

		const stream = ytdl(`https://youtu.be/${song.url}`, {
			filter: song.opus
				? format => format.type === 'audio/webm; codecs="opus"'
				: 'audioonly'
		}).on('error', err => this.client.emit('error', err));

		this.connection.play(stream, {
			bitrate: this.voiceChannel.bitrate / 1000,
			passes: 5,
			type: song.opus ? 'webm/opus' : 'unknown',
			volume: false
		});

		this.pushPlayed(song.url);

		return this.dispatcher;
	}

	pushPlayed(url) {
		this.recentlyPlayed.push(url);
		if (this.recentlyPlayed.length > 10) this.recentlyPlayed.shift();
	}

	pause() {
		const { dispatcher } = this;
		if (dispatcher) dispatcher.pause();
		return this;
	}

	resume() {
		const { dispatcher } = this;
		if (dispatcher) dispatcher.resume();
		return this;
	}

	skip(force = false) {
		const { dispatcher } = this;
		if (force && dispatcher) dispatcher.end();
		else this.queue.shift();
		return this;
	}

	prune() {
		this.queue.length = 0;
		return this;
	}

	clear() {
		this.recentlyPlayed.length = 0;
		this.queue.length = 0;
		this.channel = null;
		this.autoplay = false;
		this._next = null;

		return this;
	}

}

module.exports = MusicManager;
