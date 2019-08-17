const axios = require('axios');
const config = require('../config/config.json');

// Sends a message
const sendMessage = (msg) => {
    const url = `https://api.telegram.org/bot${config.botKey}/sendMessage`;
    botAction(url, msg, "SEND MESSAGE");
};

// Send a poll
const sendPoll = (poll) => {
    const url = `https://api.telegram.org/bot${config.botKey}/sendPoll`;
    botAction(url, poll, "SEND POLL");
};

// Trigger a bot action
const botAction = (url, body, actionType) => {
    console.log(`Action: ${actionType}, Contents: ${JSON.stringify(body)}`);

    axios.post(url, msg)
        .then(response => {
            console.log(`Bot action successfully completed. Response Code: ${response.status}, Text: ${response.statusText}`);
        })
        .catch(err => {
            console.log(`Error sending bot action: ${err}`);
        });
};

module.exports = {
    sendMessage,
    sendPoll
}