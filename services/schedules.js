const config = require('../config/config.json');
const bot = require('../bot/commands');
const db = require('../services/database');
const Schedule = require('../models/schedule');
const helper = require('./helper');

// Complete the appropriate processing for schedules that need to be acted upon
const processSchedules = async () => {
    // Connect to the database 
    await db.connectToDatabase();

    // Retrieve schedules from the database
    const dayNum = await helper.getDayNum(new Date());
    let schedules = await Schedule.find({ day: dayNum, status: "idle"});

    console.log(`Schedules retrieved: ${schedules}`);

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
const cleanupSchedules = async () => {

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
            obj = await getSendMessageObj(schedule.description);
            await bot.sendMessage(obj);
            break;
        case "sendPoll":
            obj = await getSendPollObj(schedule.description);
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
        case "sabhaFollowUp":
            messageObj.text = "*Sabha Sanchalaks*\nWe can getting close to Sunday. Please follow-up with the assigned presenters for this week to make sure that they are ready for sabha!";
            break;

        case "sabhaSummary":
            messageObj.text = "*Sabha Sanchalaks*\nFriendly reminder to send out last sabha's summary to parents if you haven't already done so!";
            break;

        case "sabhaAssignments":
            messageObj.text = "*Sabha Sanchalaks*\nIf you haven't done already, please assign presentations for our upcoming sabha ASAP! The faster you assign it, the more time the presenter will have to prepare!";
            break;
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