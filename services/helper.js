const config = require('../config/config.json');

// Returns the day number for the provided Date object
// OPTIONAL PARAM - Add or subtract the provided number of days
const getDayNum = (date, days) => {

    if (days !== undefined) {
        date.setDate(date.getDate() - days);
    }

    if (date instanceof Date) {
        // Adjust the time difference between UTC and CST
        date.setHours(date.getHours() - config.timeDifference);

        return date.getDay();
    }

    return -1;
}

// Returns the count for the given option from the list of poll options
const getPollOptionCount = (list, optionLabel) => {

    for (const option of list) {
        if (option.text.toLowerCase() === optionLabel.toLowerCase()) {
            return option.voter_count;
        }
    }

    // Default value if the provided option was not found
    return 0;
};

module.exports = {
    getDayNum,
    getPollOptionCount
};