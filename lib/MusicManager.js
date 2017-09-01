const ytdl = require('ytdl-core');
const getInfoAsync = require('util').promisify(ytdl.getInfo);

module.exports = class InterfaceMusic {

    constructor(guild) {
        Object.defineProperty(this, 'client', { value: guild.client });
        Object.defineProperty(this, 'guild', { value: guild });
        this.recentlyPlayed = new Array(10);
        this.queue = [];
        this.channel = null;

        this.dispatcher = null;

        this.autoplay = false;
        this.next = null;

        this.status = 'idle';
    }

    async add(user, url) {
        const song = await getInfoAsync(url).catch((err) => {
            this.client.emit('log', err, 'error');
            throw `Something happened with YouTube URL: ${url}\n${'```'}${err}${'```'}`;
        });

        const metadata = {
            url: `https://youtu.be/${song.video_id}`,
            title: song.title,
            requester: user,
            loudness: song.loudness,
            seconds: parseInt(song.length_seconds)
        };

        this.queue.push(metadata);

        this.next = this.getLink(song.related_videos);

        return metadata;
    }

    getLink(playlist) {
        for (const song of playlist) {
            if (!song.id || this.recentlyPlayed.includes(`https://youtu.be/${song.id}`)) continue;
            return `https://youtu.be/${song.id}`;
        }
        return null;
    }

    join(voiceChannel) {
        return voiceChannel.join()
            .catch((err) => {
                if (String(err).includes('ECONNRESET')) throw 'There was an issue connecting to the voice channel.';
                this.client.emit('log', err, 'error');
                throw err;
            });
    }

    async leave() {
        if (!this.voiceChannel) throw 'I am not in a voice channel.';
        await this.voiceChannel.leave();
        this.dispatcher = null;
        this.status = 'idle';
        return this;
    }

    async play() {
        if (!this.voiceChannel) throw 'I am not in a voice channel.';
        else if (!this.connection) throw 'I could not find a connection.';
        else if (!this.queue[0]) throw 'The queue is empty.';

        this.pushPlayed(this.queue[0].url);

        const stream = ytdl(this.queue[0].url, { filter: (format) => !format.bitrate && format.audioEncoding === 'opus' })
            .on('error', err => this.client.emit('log', err, 'error'));

        this.dispatcher = this.connection.playStream(stream, { passes: 5 });
        return this.dispatcher;
    }

    pushPlayed(url) {
        this.recentlyPlayed.push(url);
        this.recentlyPlayed.shift();
    }

    pause() {
        this.dispatcher.pause();
        this.status = 'paused';
        return this;
    }

    resume() {
        this.dispatcher.resume();
        this.status = 'playing';
        return this;
    }

    skip(force = false) {
        if (force && this.dispatcher) this.dispatcher.end();
        else this.queue.shift();
        return this;
    }

    prune() {
        this.queue = [];
        return this;
    }

    async destroy() {
        this.prune();
        if (this.voiceChannel) this.voiceChannel.leave();
        this.client.queue.delete(this.guild.id);
        return null;
    }

    get voiceChannel() {
        return this.guild.me.voiceChannel;
    }

    get connection() {
        return this.voiceChannel ? this.voiceChannel.connection : null;
    }

};
