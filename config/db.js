const mongoose = require('mongoose');
const envConfig = require('./env');

// const uri = "mongodb+srv://<>:<>@cluster0.htedkjhiu.mongodb.net/hnuogyu?retryWrites=true&w=majority"
const uri = "mongodb+srv://" + envConfig.ATLASDB_USERNAME + ":" + envConfig.ATLASDB_PASSWORD + "@" + envConfig.ATLASDB;

module.exports = function() {
    console.log(uri);

    mongoose.connect(uri);

    const mongodb = mongoose.connection;

    mongodb.on("error", console.error.bind(console, 'Connection Error'));
    mongodb.once("open", ()=> {
        console.log('Connected to MongDB');
    });

    return mongodb;
}
