const config = require('../config/config.json');

// Returns the day number for the provided Date object
const getDayNum = (date) => {
    if (date instanceof Date) {
        // Adjust the time difference between UTC and CST
        date.setHours(date.getHours() - config.timeDifference);

        return date.getDay();
    }

    return -1;
}

module.exports = {
    getDayNum
};