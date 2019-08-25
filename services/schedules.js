const config = require('../config/config.json');
const bot = require('../bot/commands');
const db = require('../services/database');
const messages = require('./messages');
const Schedule = require('../models/schedule');
const helper = require('./helper');

// Complete the appropriate processing for schedules that need to be acted upon
const processSchedules = async () => {
    // Connect to the database 
    await db.connectToDatabase();

    // Retrieve schedules from the database
    const dayNum = await helper.getDayNum(new Date());
    let schedules = await Schedule.find({ day: dayNum, status: { $ne: "completed"}});

    // console.log(`Schedules retrieved: ${schedules}`);

    if (schedules.length > 0) {
        // Trigger bot actions as needed for each schedule
        await triggerBotActions(schedules);
        return "Completed processing all schedules";
    }
    else {
        return "No schedules to process at this time";
    }
};

// TODO: Need to implement
const resetSchedules = async () => {
    // Connect to the database 
    await db.connectToDatabase();

    // Get list of schedules that need to be reset
    const dayNum = await helper.getDayNum(new Date(), 3);
    let schedules = await Schedule.find({ day: dayNum });


    // Update the status back to idle for each of them
    if (schedules.length > 0) {
        for (const schedule of schedules) {
            schedule.status = "idle";
            await Schedule.updateOne({_id: schedule._id}, schedule);
            console.log(`Completed resetting ${schedule.name} schedule`);
        }
        return "Completed reseting all schedules";

    }
    else {
        return "No schedules to reset at this time";
    }
};

// Call triggerBotAction for all schedules that need to be processed
const triggerBotActions = async (schedules) => {

    for (const schedule of schedules) {
        let result = await triggerBotAction(schedule);
        await processBotResponse(schedule, result);
        console.log(`Completed processing ${schedule.name} schedule`);
    }
};

// Trigger the appropriate bot action based on the schedule type
const triggerBotAction = async (schedule) => {
    let obj;
    let result = null;

    switch (schedule.type) {
        case "sendMessage":
            obj = await getSendMessageObj(schedule);
            result = await bot.sendMessage(obj);
            break;
        case "sendPoll":
            obj = await getSendPollObj(schedule);
            result = await bot.sendPoll(obj);
            break;
        default:
            console.log("Unsupported schedule type");
    }
    return result;
};


// Process the result returned from triggerBotAction method
const processBotResponse = async (schedule, result) => {
    schedule.lastTriggered = new Date();

    if (result instanceof Error) {
        schedule.status = "errored";
    } else {
        schedule.status = "triggered";

        // Update status to completed for "sendPoll" schedules
        if (schedule.type === "sendPoll") {
            schedule.status = "completed";
        }
        schedule.lastMessageId = result.message_id;
    }

    await Schedule.updateOne({_id: schedule._id}, schedule);
    console.log("Completed processing bot response");
};

// Get the object required to perform the sendMessage action
const getSendMessageObj = (schedule) => {
    let messageObj = {
        chat_id: schedule.chatId,
        parse_mode: "Markdown",
        text: messages.getMessage(schedule.status, schedule.description)
    };

    return messageObj;
};

// Get the object required to perform the sendPoll action
const getSendPollObj = (schedule) => {
    let pollObj = {
        chat_id: schedule.chatId,
        pollObj: ["Yes", "No"],
        question: getMessage(schedule.status, schedule.desciption)
    };

    return pollObj;
};

// Get the object required to perform the stopPoll action
const getStopPollObj = (schedule) => {
    let pollObj = {
        chat_id: schedule.chatId,
        message_id: lastMessageId
    };

    return pollObj;
};

module.exports = {
    processSchedules,
    resetSchedules
};