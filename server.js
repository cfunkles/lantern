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

//register new user
app.post('/api/user', function(req, res) {
    //validates form entries
    //add this validation check later
    // if(req.body.password.length < 10) {
    //     res.send('password error');
    //     return;
    // }
    var requiredInput = ['username', 'password', 'name', 'state', 'email', 'agreedToTerms'];
    for (var i = 0; i < requiredInput.length; i++) {
        if (req.body[requiredInput[i]] === undefined) {
            console.log('user did not fill in ' + requiredInput[i]);
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
            console.log('account created!');
        } else {
            //what to do if username exists
            res.send('exists');
            console.log('account exists!');
        }
    });
});

app.get('/api/user/:username/:password', function(req, res) {
    db.collection('users').findOne({
        username: req.params.username,
        password: req.params.password
    }, function(err, user) {
        if(user === null) {
            res.send('login error');
            return;
        }
        console.log('user logged in!');
        logIn(req, user);
        res.send(user);
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
