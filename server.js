var express = require('express');
var app = express();

//body parser boilerplate
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//express session boilerplate
var expressSession = require('express-session');
var secret = require('./secret.js');
app.use(expressSession({
	secret: secret.secret, // SECRET! Don't push to github
	resave: false,
	saveUninitialized: true
}));
//verification function
function logIn(req, data) {
    req.session.user = {
        _id: data._id,
        username: data.username
    };
}

//mongo database
var mongodb = require('mongodb');
var db;
mongodb.MongoClient.connect("mongodb://localhost", function(err, database) {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Connected to Lantern database!');
    db = database;
    startListening();
});

app.post('/api/user', function(req, res) {
    //string validation to prevent empty strings
    var requiredInput = ['username', 'passwordInputTwo', 'state', 'email', 'age', 'agreedToTerms'];
    for (var i = 0; i < requiredInput.length; i++) {
        if (req.body[requiredInput[i]] === undefined) {
            console.log(requiredInput[i]);
            res.send('form incomplete');
            return;
        }
    }
    db.collection('users').findOne({
        //only searching for username
        username: req.body.username,
    }, function(err, user) {
        if (user === null) {
            //creates user only if it doesn't exist
            db.collection('users').insert(req.body, function(err, creationInfo) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send("error");
                    return;
                }
            });
            //can't use data as param because it is null, just need to use req.body instead
            logIn(req, req.body);
            res.send('success');
            console.log('account created!')
        } else {
            //what to do if username exists
            res.send('exists');
            console.log('account exists!');
        }
    });
});

app.use(express.static('public'));

// 404 File Not Found
app.use(function(req, res, next) {
	res.status(404);
	res.send("404 File not Found");
});

// 500 Server Error Handler
app.use(function(err, req, res, next){
	console.log(err);
	res.status(500);
	res.send("500 Internal Server Error");
});

//starts server after database connection
function startListening() {
    app.listen(8080, function() {
        console.log('Server Started http://localhost:8080 Let\'s get camping!');
    });
}
