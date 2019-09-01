const axios = require('axios');
const config = require('../config/config.json');

// Sends a message
const sendMessage = async (msg) => {
    const url = `https://api.telegram.org/bot${config.botKey}/sendMessage`;

    let response = await botAction(url, msg, "SEND MESSAGE");
    return response;
};

// Send a poll
const sendPoll = async (poll) => {
    const url = `https://api.telegram.org/bot${config.botKey}/sendPoll`;

    let response = await botAction(url, poll, "SEND POLL");
    return response;
};

// Stop a poll
const stopPoll = async (poll) => {
    const url = `https://api.telegram.org/bot${config.botKey}/stopPoll`;

    let response = await botAction(url, poll, "STOP POLL");
    return response;
};

// Trigger a bot action
const botAction = async (url, body, actionType) => {
    console.log(`Action: ${actionType}, Contents: ${JSON.stringify(body)}`);

    return await axios.post(url, body)
        .then(response => {
            console.log(`Bot action successfully completed. Response Code: ${response.status}, Text: ${response.statusText}`);
            return response.data.result;
        })
        .catch(err => {
            console.log(`Error sending bot action: ${err}`);
            return err;
        });
};

module.exports = {
    sendMessage,
    sendPoll,
    stopPoll
}