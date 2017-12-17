const { Event } = require('klasa');

module.exports = class extends Event {

    run() {
        return this.client.user.setActivity('Sneyra, help', { type: 2 })
            .catch(err => this.client.emit('log', err, 'error'));
    }

};
