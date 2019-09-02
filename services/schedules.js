const config = require('../config/config.json');
const bot = require('../bot/commands');
const db = require('../services/database');
const messages = require('./messages');
const Schedule = require('../models/schedule');
const helper = require('./helper');

// Complete the appropriate processing for schedules that need to be acted upon
const processSchedules = async () => {
    let returnMsg;

    // Connect to the database 
    await db.connect();

    // Setup the database query
    const dayNum = await helper.getDayNum(new Date());
    const query = {
        $or: [
            {
                $and: [
                    { status: "idle" },
                    { day: dayNum }
                ]
            },
            {
                $and: [
                    {status: "triggered" },
                    { day: { $ne: dayNum } }
                ]
            },
            {
                status: "rety"
            }
        ]
    };

    // Retrieve schedules from the database
    let schedules = await Schedule.find(query);

    console.log(`Schedules retrieved: ${schedules}`);

    if (schedules.length > 0) {
        // Trigger bot actions as needed for each schedule
        await triggerBotActions(schedules);
        returnMsg = "Completed processing all schedules";
    }
    else {
        returnMsg = "No schedules to process at this time";
    }

    // Close database connection
    await db.disconnect();

    return returnMsg;
};

// Reset schedules that need to be reset
const resetSchedules = async () => {
    let returnMsg;

    // Connect to the database 
    await db.connect();

    // Get list of schedules that need to be reset
    const dayNum = await helper.getDayNum(new Date(), 3);
    let schedules = await Schedule.find({ day: dayNum });


    // Update the status back to idle for each of them
    if (schedules && schedules.length > 0) {
        for (const schedule of schedules) {
            // Update confirmationCount to 0 if the schedule has a count
            if (schedule.confirmationCount) {
                schedule.confirmationCount = 0;
            }

            schedule.status = "idle";

            await Schedule.updateOne({_id: schedule._id}, schedule);
            console.log(`Completed resetting ${schedule.name} schedule`);
        }
        returnMsg = "Completed reseting all schedules";

    }
    else {
        returnMsg = "No schedules to reset at this time";
    }

    // Close database connection
    await db.disconnect();

    return returnMsg;
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
    } 
    else {
        // Set status to completed for schedules that do not need confirmations
        if (!schedule.confirmations) {
            schedule.status = "completed";
            schedule.lastMessageId = result.message_id;
        }
        // Update schedule with "sendPoll" description
        else if (schedule.type === "sendPoll") {
            schedule.status = "completed";
            schedule.lastMessageId = result.poll.id;       
        } 
        // Otherwise update for schedules with other descriptions as below
        else {
            schedule.status = "triggered";
            schedule.lastMessageId = result.message_id;
        }
    }

    await Schedule.updateOne({_id: schedule._id}, schedule);
    console.log("Completed processing bot response");
};

// Get the object required to perform the sendMessage action
const getSendMessageObj = (schedule, defaultText = null, replyId = null) => {
    let messageObj = {
        chat_id: schedule.chatId,
        parse_mode: "Markdown",
    };

    if (defaultText === null) {
        messageObj.text = messages.getMessage(schedule.status, schedule.description);
    } 
    else {
        messageObj.text = defaultText;
    }

    if (replyId !== null) {
        messageObj.reply_to_message_id = replyId;
    }

    return messageObj;
};

// Get the object required to perform the sendPoll action
const getSendPollObj = (schedule, defaultQuestion = null) => {
    let pollObj = {
        chat_id: schedule.chatId,
        options: ["Yes", "No"],
    };

    if (defaultQuestion === null) {
        pollObj.question = messages.getMessage(schedule.status, schedule.description);
    }
    else {
        pollObj.question = defaultQuestion;
    }

    return pollObj;
};

// Process reply message from a bot for schedule
const processReplyMessageForSchedule = async (msg) => {
    let replyMsg = msg.reply_to_message;

    // Connect to the database 
    await db.connect();

    // Find the matching schedule from database
    let foundSchedule = await Schedule.findOne({ lastMessageId: replyMsg.message_id});

    // Update schedule if it tracks confirmations and hasn't been completed
    if (foundSchedule && foundSchedule.status !== "completed" && foundSchedule.confirmations) {
        foundSchedule.confirmationCount++;

        let defaultText = null;

        // Also change status if enough confirmations have been receieved
        if (foundSchedule.confirmationCount >= foundSchedule.confirmations) {
            foundSchedule.status = "completed";

            // TODO: Send message that all confirmations have been received
            defaultText = "Thank you for the responses guys!";
        } 
        else {
            // TODO: Send message that more confirmations are still needed
            defaultText = "Thank you for the response! I believe I still need a response from other karyakar(s) as well";
        }

        let obj = await getSendMessageObj(foundSchedule, defaultText, msg.message_id);
        await bot.sendMessage(obj);

        await Schedule.updateOne({_id: foundSchedule._id}, foundSchedule);
    }
    else {
        console.log(`No action as confirmations are not tracked for schedule`);   
    }

    // Close database connection
    await db.disconnect();
};


const processPollForSchedule = async (poll) => {
    // Connect to the database 
    await db.connect();

    // Find the matching schedule from database
    let foundSchedule = await Schedule.findOne({ lastMessageId: poll.id});

    // TODO: Update the poll schedule accordingly
    if (foundSchedule && foundSchedule.description === "weeklyCall") {
        let no = helper.getPollOptionCount(poll.options, "no");

        // If more than one no received, set status to retry and close poll
        if (no > foundSchedule.confirmationCount) {
            await bot.stopPoll({ chat_id: messages.chatId, message_id: foundSchedule.lastMessageId});

            foundSchedule.status = "retry";
            await Schedule.updateOne({_id: foundSchedule._id}, foundSchedule);
        }
    }
    else if (foundSchedule) {
        console.log("Only weekly call polls are currently supported");
    }

    // Close database connection
    await db.disconnect();    
};

module.exports = {
    processSchedules,
    resetSchedules,
    processReplyMessageForSchedule,
    processPollForSchedule
};