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
    status: {
        type: String,
        required: true
    },
    lastTriggered: {
        type: Date,
        required: true
    }
});

module.exports = Schedule = mongoose.model("schedules", scheduleSchema);