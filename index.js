const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config.json');
const scheduling = require('./services/schedules');
const analyzer = require('./services/analyze');

const app = express();

app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ message: "bots-seva-assistant-reminders is running!"});
});

// Trigger schedules endpoint
app.post('/schedules/trigger', (req, res) => {
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
app.post('/schedules/reset', (req, res) => {
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

// Read message endpoint
app.post('/read', (req, res) => {
    if (req.body !== undefined && req.body.message !== undefined) {
        let message = req.body.message;
        console.log(JSON.stringify(message));

        analyzer.processMessage(message)
            .then((msg) => {
                res.status(200).json({ message: msg });
            })
            .catch((err) => {
                console.log(`Error analyzing message: ${err.message}`);
                res.status(500).json({ error: `Error analyzing message: ${err.message}` });
            });
    }
    else {
        res.status(400).json({ error: "No message provided"});
    }
});


app.listen(config.port, () => {
    console.log(`bots-seva-assistant-reminder is running on port ${config.port}`);
});


