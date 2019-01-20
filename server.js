var express = require('express');
var app = express();
var passport   = require('passport');
var session    = require('express-session');
var env = require('dotenv').load();
var exphbs = require('express-handlebars')

//Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
// For Passport
// session secret
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true}));  
app.use(passport.initialize()); 
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

 
app.get('/', function(req, res) {
 
    res.send('Welcome to Passport with Sequelize');
 
});

//Models
var models = require("./app/models");

//Routes
var authRoute = require('./app/routes/auth.js')(app, passport);

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);
 
// Sync Database and listen to local server
models.sequelize.sync().then(function() {
    app.listen(5000, function(err) {
        console.log("Server is running on port 5000 and database looks fine")
    }) 
}).catch(function(err) { 
    console.log(err, "Something went wrong with the Database Update!") 
});