const express = require('express');
const bodyParser = require('body-parser');
const scheduling = require('./services/schedules');
const analyzer = require('./services/analyze');

const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ message: "bots-seva-assistant-reminders is running!"});
});

// Trigger schedules endpoint
app.post('/schedules', (req, res) => {
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
app.put('/schedules', (req, res) => {
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
app.post('/messages', (req, res) => {
    if (req.body) {
        res.status(200).end();

        let message = req.body;
        console.log(`Incoming message: ${JSON.stringify(message)}`);

        analyzer.processMessage(message)
            .then(() => {
                console.log(`Analyzed message successfully`);
            })
            .catch((err) => {
                console.log(`Error analyzing message: ${err.message}`);
            });
    }
    else {
        res.status(400).json({ error: "No message provided"});
    }
});


app.listen(port, () => {
    console.log(`bots-seva-assistant-reminder is running on port ${port}`);
});


