const mongoose = require('mongoose');
const UserSchema = require("../model/user")
require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const connectionString = process.env.DB_STRING;

const connection = mongoose.createConnection(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const User = connection.model('User', UserSchema);

// Expose the connection
module.exports = connection;
