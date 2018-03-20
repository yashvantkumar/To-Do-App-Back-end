var mongoose = require('mongoose');

var mongo = {
    URI: process.env.MONGO_URI || 'mongodb://localhost/todo',
    port: 27017
};

var redis = {
    URI: '127.0.0.1'
};

module.exports = {
    mongo: mongo
};

//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/todo', function (err) {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected');
    }
});