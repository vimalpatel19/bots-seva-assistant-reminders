const mongoose = require('mongoose');
const config = require('../config/config.json');

const connectToDatabase = async () => {
    await mongoose
        .connect(config.mongo, { useNewUrlParser: true})
        .then(() => console.log("Connected to database"))
        .catch((err) => {
            throw new Error("error connecting to database");
        });
};

module.exports = {
    connectToDatabase
};