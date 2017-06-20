var express = require('express');
var app = express();
var multer = require('multer');

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
function setUpSession(req, user) {
    req.session.user = {
        _id: user._id,
        username: user.username
    };
}

//mongo database
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
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

//register new user route
app.post('/api/user/registration', function(req, res) {
    //validates form entries
    //add this validation check later
    // if(req.body.password.length < 10) {
    //     res.send('password error');
    //     return;
    // }
    var requiredInput = ['username', 'password', 'name', 'state', 'email', 'agreedToTerms'];
    for (var i = 0; i < requiredInput.length; i++) {
        if (req.body[requiredInput[i]] === undefined) {
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
            req.body.ratings = '';
            db.collection('users').insertOne(req.body, function(err, creationInfo) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send("error");
                    return;
                }
                setUpSession(req, req.body);
                res.send({success:'success'});
                console.log('account created!', req.body.name);
            });
        } else {
            res.send('exists');
        }
    });
});

//request for user information
app.get('/api/user', function(req, res) {
    if(!req.session.user){
        res.status(403);
        res.send('forbidden');
        return;
    }
    db.collection('users').findOne({
        username: req.session.user.username
    }, function(err, user) {
        if(err) {
            console.log(err);
            res.status(500);
            res.send('error');
            return;
        }
        res.send(user);
    });
});

//login route
app.post('/api/user/login', function(req, res) {
    db.collection('users').findOne(req.body, function(err, user) {
        if(user === null) {
            res.send('login error');
            return;
        }
        console.log('user logged in!', req.body.username);
        setUpSession(req, user);
        res.send(user);
    });
});

//new item route
app.post('/api/equipments', multer({dest: 'public/images'}).single('gearImage'), function(req, res) {
    if(!req.session.user){
        res.status(403);
        res.send('forbidden');
        return;
    }
    req.body.imageFileName = req.file.filename;
    req.body.ownerId = req.session.user._id;
    req.body.usersRenting = [];
    db.collection('equipments').insertOne(req.body, function(err, creationInfo) {
        if(err) {
            console.log(err);
            res.status(500);
            res.send('error');
            return;
        }
        console.log(req.body);
        console.log(req.file);
        res.send({success:'success'});
    });
});

//search database for items per user
app.get('/api/equipments/userowned', function(req, res) {
    if(!req.session.user){
        res.status(403);
        res.send('forbidden');
        return;
    }
    db.collection('equipments').find({
        ownerId: req.session.user._id
    }).toArray(function(err, itemsArray) {
        if(err) {
            console.log(err);
            res.status(500);
            res.send('error');
            return;
        }
        res.send(itemsArray);
    });
});

//get the Items users checked out
app.get('/api/equipments/usercheckouts', function(req, res) {
    if(!req.session.user){
        res.status(403);
        res.send('forbidden');
        return;
    }
    db.collection('equipments').find({
        'usersRenting.userId': req.session.user._id
    }).toArray(function(err, itemsArray) {
        if(err) {
            console.log(err);
            res.status(500);
            res.send('error');
            return;
        }
        res.send(itemsArray);
    });
});

//search database by city name. To Do handel title case manipulations
app.get('/api/equipments/:city', function(req, res) {
    //send whole database on empty query
    if(req.params.city === 'all') {
        db.collection('equipments').find().toArray(function(err, allArray) {
            if(err) {
                console.log(err);
                res.status(500);
                res.send('error');
                return;
            }
            res.send(allArray);
        });
    } else {
        db.collection('equipments').find({
            city: req.params.city
        }).toArray(function(err, searchArray) {
            if(err) {
                console.log(err);
                res.status(500);
                res.send('error');
                return;
            }
            res.send(searchArray);
        });
    }
});

//search item availibility
app.get('/api/equipments/dates/:_id', function(req, res) {
    db.collection('equipments').findOne({_id: ObjectID(req.params._id)}, function(err, equipmentItem) {
        if (err) {
            console.log(err);
            res.status(500);
            res.send('error');
            return;
        }
        console.log('success');
        res.send(equipmentItem);
    });
});

//checkout item
app.post('/api/equipments/dates', function(req, res) {
    if(!req.session.user){
        res.status(403);
        res.send('forbidden');
        return;
    }
    if(!req.body.date) {
        res.send('empty');
        return;
    }
    db.collection('equipments').findOne({_id: ObjectID(req.body.objectId)}, function(err, equipmentItem) {
        if (err) {
            console.log(err);
            res.status(500);
            res.send('error');
            return;
        }
        for (let rental in equipmentItem.usersRenting) {
            if (req.body.date === equipmentItem.usersRenting[rental].date) {
                res.send({duplicated:'duplicated'});
                return;
            }
        }
        db.collection('equipments').updateOne(
            {_id: ObjectID(req.body.objectId)},
            {$push: {usersRenting: {userId: req.session.user._id, date: req.body.date}}},
            function(err, updateStatus) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send('error');
                return;
            }
            res.send({success:'success'});
        });
    });
});

app.post('/api/users/message', function(req, res) {
    if(!req.session.user){
        res.status(403);
        res.send('forbidden');
        return;
    }
    if(!req.body.message) {
        res.send('empty');
        return;
    }
    console.log('your message', req.body);
    db.collection('users').insertOne({
        ObjectID: ObjectID(req.body.owernId)},
        {$push: {messages: {sender: req.session.user._id, message: req.body.message}}}, 
        function(err, updateStatus) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send('error');
                return;
            }
            console.log('message added!');
            res.send({success:'success'});
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
