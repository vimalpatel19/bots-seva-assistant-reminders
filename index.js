const express = require('express');
const config = require('./config/config.json');
const bot = require('./bot/command');

const app = express();

// Reminder Message types
const WEEKLY_CALL_REMINDER = "weekly_call";

app.get('/', (req, res) => {
    res.status(200).json({ message: 'bots-seva-assistant-reminder is up!'});
});

// NOTE: The port does not matter when deployed to Now
app.listen(config.port, () => {
    console.log(`bots-seva-assistant-reminder is running on port ${config.port}`);
});

// console.log(`Running reminder-bot at: ${new Date()}`);

// // Verify reminder type has been provided
// if (req.body === undefined || req.body.reminderType === undefined || req.body.reminderType === "") {
//     res.status(400).json({ error: "Provide the reminder type" });
//     return;
// }

// res.status(200).json({ message: "Serverless function call being executed now..." });

// let messageObj = {
//     chat_id: config.chatId,
//     parse_mode: "Markdown"
// };

// // Create the appropriate reminder message based on the reminder type
// switch (req.body.reminderType) {
//     case WEEKLY_CALL_REMINDER:
//         messageObj.text = "Jai Swaminarayan guys! Reminder that we will be having our weekly call *today at 9PM*";
//         bot.sendMessage(messageObj);
//         break;
//     default:
//         messageObj.text = "Jai Swaminarayan guys! I wanted to remind you guys about something but forgot what it was :(";
//         bot.sendMessage(messageObj);
// }

