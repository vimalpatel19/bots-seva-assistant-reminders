const axios = require('axios');
const config = require('../config/config.json');

// Sends a message
const sendMessage = async (msg) => {
    const url = `https://api.telegram.org/bot${config.botKey}/sendMessage`;
    await botAction(url, msg, "SEND MESSAGE");
};

// Send a poll
const sendPoll = async (poll) => {
    const url = `https://api.telegram.org/bot${config.botKey}/sendPoll`;
    await botAction(url, poll, "SEND POLL");
};

// Trigger a bot action
const botAction = async (url, body, actionType) => {
    console.log(`Action: ${actionType}, Contents: ${JSON.stringify(body)}`);

    await axios.post(url, body)
        .then(response => {
            console.log(`Bot action successfully completed. Response Code: ${response.status}, Text: ${response.statusText}`);
            return response;
        })
        .catch(err => {
            console.log(`Error sending bot action: ${err}`);
            return err;
        });
};

module.exports = {
    sendMessage,
    sendPoll
}