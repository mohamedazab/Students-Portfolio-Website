var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');
var router = require('./routes');
var session = require('express-session');
// Create the application.
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({
    secret: "abcdgdddssss",
    resave: false,
    saveUninitialized: true
}));
// CORS Support
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static(__dirname + '/'));


//
// Connect to MongoDB
mongoose.connect('mongodb://localhost/last');
app.use(router);

app.listen(8080, function() {
    console.log("now listening 8080 yes");

})