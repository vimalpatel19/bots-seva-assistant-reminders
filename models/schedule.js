const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    chatId: {
        type: Number,
        required: true
    },
    confirmations: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    lastTriggered: {
        type: Date,
        required: false
    },
    lastMessageId: {
        type: Number,
        required: false
    },
    confirmationCount: {
        type: Number,
        required: false
    }
});

module.exports = Schedule = mongoose.model("schedules", scheduleSchema);