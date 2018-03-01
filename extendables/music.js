const { Extendable } = require('klasa');

module.exports = class extends Extendable {

    constructor(...args) {
        super(...args, { appliesTo: ['Guild'] });
    }

    get extend() {
        return this.client.queue.get(this.id) || this.client.queue.create(this);
    }

};
