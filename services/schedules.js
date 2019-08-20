const config = require('../config/config.json');
const bot = require('../bot/commands');

// Complete the appropriate processing for schedules that need to be acted upon
const processSchedules = async () => {

    // TODO: Remove mock and replace with schedules from Mongo
    let schedules = [
        // {
        //     "day": 2,
        //     "type": "sendMessage",
        //     "name": "BM Weekly Call",
        //     "desciption": "weeklyCall",
        //     "status": "triggered"
        // },
        {
            "day": 2,
            "type": "sendPoll",
            "name": "BM Weekly Call",
            "desciption": "weeklyCall",
            "status": "triggered"
        }
    ];

    await triggerBotActions(schedules);

    console.log("Completed processing all schedules");
};

// Call triggerBotAction for all schedules that need to be processed
const triggerBotActions = async (schedules) => {

    for (const schedule of schedules) {
        await triggerBotAction(schedule);
        console.log(`Completed processing ${schedule.name} schedule`);
    }
};

// Trigger the appropriate bot action based on the schedule type
const triggerBotAction = async (schedule) => {
    let obj;

    switch (schedule.type) {
        case "sendMessage":
            obj = await getSendMessageObj(schedule.desciption);
            await bot.sendMessage(obj);
            break;
        case "sendPoll":
            obj = await getSendPollObj(schedule.desciption);
            await bot.sendPoll(obj);
            break;
        default:
            console.log("Unsupported schedule type");
    }
};

// Get the object required to perform the sendMessage action
const getSendMessageObj = (description) => {
    let messageObj = {
        chat_id: config.chatId,
        parse_mode: "Markdown"
    };

    // Create the appropriate reminder message based on the description
    switch (description) {
        case "weeklyCall":
            messageObj.text = "Jai Swaminarayan guys! Reminder that we will be having our weekly call *today at 9PM*";
            break;
        default:
            messageObj.text = "Jai Swaminarayan guys! I wanted to remind you guys about something but forgot what it was :(";
    }

    return messageObj;
};

const getSendPollObj = (desciption) => {
    let pollObj = {
        chat_id: config.chatId,
    };

    switch(desciption) {
        case "weeklyCall":
            pollObj.question = "Jai Swaminarayan guys! Are you available for this week's call at 9PM tonight?";
            pollObj.options = ["Yes", "No"];
            break;
    }

    return pollObj;
};

module.exports = {
    processSchedules
};