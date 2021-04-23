const mongoose = require('mongoose');
const UserSchema = require("../model/user")
require('dotenv').config();


const connectionString = process.env.DB_STRING;

const connection = mongoose.createConnection(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connection.model('User', UserSchema);

// Expose the connection
module.exports = connection;
