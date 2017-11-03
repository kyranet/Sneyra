const { Event } = require('klasa');

module.exports = class extends Event {

    run() {
        return this.client.user.setActivity('m!help').catch(err => this.client.emit('log', err, 'error'));
    }

};
