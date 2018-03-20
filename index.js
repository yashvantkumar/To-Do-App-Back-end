var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var cookieParser = require('cookie-parser');
require('events').EventEmitter.prototype._maxListeners = 100;

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

////Imports
var config = require('./config');
var routes = require('./routes');

app.use(config.routes.todo, routes.todo);
////

//Home Route
app.get('/', function (req, res) {
    res.status(200).json({
        message: "Development Server's Live"
    });
});

//Start server
app.listen(process.env.PORT | 3000, function () {
    console.log('Express server listening on port 3007');
});