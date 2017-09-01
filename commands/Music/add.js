const { Command } = require('klasa');
const snekfetch = require('snekfetch');

const { GOOGLE_SEARCH } = require('../../config.json');

const fetchURL = url => snekfetch.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${url}&key=${GOOGLE_SEARCH}`)
    .then(result => result.body);

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ['text'],
            usage: '<url:string>'
        });
        this.regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed)?)?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([\w-]{11})(?:[^\w-]|$)/;
    }

    async run(msg, [url]) {
        const youtubeURL = await this.getURL(url);
        if (!youtubeURL) throw 'Not found.';

        const { music } = msg.guild;
        const song = await music.add(msg.author, youtubeURL);

        return msg.send(`🎵 Added **${song.title}** to the queue 🎶`);
    }

    async getURL(url) {
        const id = this.regExp.exec(url);
        if (id) return `https://youtu.be/${id[1]}`;
        const data = await fetchURL(encodeURIComponent(url));
        const video = data.items.find(item => item.id.kind !== 'youtube#channel');

        return video ? `https://youtu.be/${video.id.videoId}` : null;
    }

};
