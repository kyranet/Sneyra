const { Client } = require('klasa');
const Music = require('./Music');

class Sneyra extends Client {

    constructor(options) {
        super(options);

        this.queue = new Music();
    }

}

module.exports = Sneyra;
