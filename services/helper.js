const config = require('../config/config.json');

// Returns the day number for the provided Date object
// OPTIONAL PARAM - Add or subtract the provided number of days
const getDayNum = (date, days = null) => {

    if (date instanceof Date) {
        // Adjust the time difference between UTC and CST
        date.setHours(date.getHours() - config.timeDifference);

        // Adjust the date if days has been provided
        if (days !== null) {
            date.setDate(date.getDate() - days);
        }

        console.log(`Returned date from getDayNum: ${date}`);

        return date.getDay();
    }

    return -1;
}

// Returns today's date with time set to midnight
const getToday = () => {
    let date = new Date();

    // Adjust the time difference between UTC and CST
    date.setHours(date.getHours() - config.timeDifference);

    date.setHours(0, 0, 0, 0);

    console.log(`Returned date from getDayNum: ${date}`);
    return date;
};

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
    getToday,
    getPollOptionCount
};