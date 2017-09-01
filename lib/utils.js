const moment = require('moment');
require('moment-duration-format');

class Utils {

    /**
     * Split a string by its latest space character in a range from the character 0 to the selected one.
     * @param {string} str    The text to split.
     * @param {number} length The length of the desired string.
     * @returns {string}
     * @static
     */
    static splitText(str, length) {
        const x = str.substring(0, length).lastIndexOf(' ');
        const pos = x === -1 ? length : x;
        return str.substring(0, pos);
    }

    /**
     * Show time duration in an un-trimmed h:mm:ss format.
     * @param {number} duration Duration in milliseconds.
     * @returns {string}
     */
    static showSeconds(duration) {
        return moment.duration(duration).format('h:mm:ss', { trim: false });
    }

}

module.exports = Utils;
