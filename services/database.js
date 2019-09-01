const mongoose = require('mongoose');
const config = require('../config/config.json');

const connect = async () => {
    await mongoose
        .connect(config.mongo, { useNewUrlParser: true})
        .then(() => console.log("Connected to database"))
        .catch((err) => {
            throw new Error(`error connecting to database ${err.message}`);
        });
};

const disconnect = async () => {
    await mongoose.connection.close();
};

module.exports = {
    connect,
    disconnect
};