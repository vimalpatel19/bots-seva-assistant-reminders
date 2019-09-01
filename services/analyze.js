const scheduling = require('./schedules');

// Process the incoming message received
const processMessage = async (msg) => {

    // Determine if the message is a reply message
    if (msg.message && msg.message['reply_to_message']) {
        await processReplyMessage(msg.message);
    }
    // Otherwise if it is for a poll
    else if (msg.poll) {
        await scheduling.processPollForSchedule(msg.poll);
    }
    else {
        console.log("Currently not supporting non-reply messages");
    }
};

// Process messages that are a reply message
const processReplyMessage =  async (msg) => {

    // Determine if the original message was from a bot
    if (msg['reply_to_message'].from['is_bot'] && msg.text.toLowerCase() === "yes") {
        await scheduling.processReplyMessageForSchedule(msg);
    } 
    else {
        console.log("Currently supporting reply messages only from bots");
    }
}

module.exports = {
    processMessage
}