const express = require('express');
const config = require('./config/config.json');
const scheduling = require('./services/schedules');

const app = express();

// Trigger schedules endpoint
app.get('/schedules/trigger', (req, res) => {
    scheduling.processSchedules()
        .then((msg) => {
            console.log(msg);
            res.status(200).json({ message: msg });
        })
        .catch((err) => {
            console.log(`Error processing schedules: ${err.message}`);
            res.status(500).json({ error: `Error processing schedules: ${err.message}` });
        });
});

// Reset schedules endpoint
app.get('/schedules/reset', (req, res) => {
    scheduling.resetSchedules()
    .then((msg) => {
        console.log(msg);
        res.status(200).json({ message: msg });
    })
    .catch((err) => {
        console.log(`Error reseting schedules: ${err.message}`);
        res.status(500).json({ error: `Error reseting schedules: ${err.message}` });
    });
});

// TODO - Read message endpoint
app.get('/read', (req, res) => {

});

// NOTE: The port does not matter when deployed to Now
app.listen(config.port, () => {
    console.log(`bots-seva-assistant-reminder is running on port ${config.port}`);
});


