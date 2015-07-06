var express     = require('express');
var session     = require('express-session')
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var app         = express();
var cookieParser= require('cookie-parser');




var passportSocketIo = require("passport.socketio");


var mongoose    = require('mongoose');
var passport    = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config    = require('yaml-config');
var settings  = config.readConfig('app/config/app.yml')


var GOOGLE_CLIENT_ID = settings.google.client_id;
var GOOGLE_CLIENT_SECRET = settings.google.client_secret;

var MongoStore = require('connect-mongo')(session);
var MongoSessionStore = new MongoStore({url: 'mongodb://127.0.0.1/retro'});

//var sessionMiddleware = session({
//    name: "scrummer",
//    secret: 'keyboard cat',
//    resave: true,
//    saveUninitialized: true,
//    store:  MongoSessionStore,
//    cookie: {}
//});


app.use(morgan('dev'));
//app.use(sessionMiddleware);
//app.use(express.cookieParser());
app.use(cookieParser());
app.use(session({
    name: "scrummer",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoSessionStore
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1/retro');

var Retro       = require('./backend/models/retro');
var Response    = require('./backend/models/response');
var User        = require('./backend/models/user');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('app/public'));

var server = app.listen(3000);

server.listen(3000, function(){
  console.log('listening on *:3000');
});




var io = require('socket.io')(server)



io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:          'scrummer',           // the name of the cookie where express/connect stores its session_id
    secret:       'keyboard cat',       // the session_secret to parse the cookie
    store:        MongoSessionStore,    // we NEED to use a sessionstore. no memorystore please
    success:      onAuthorizeSuccess,    // *optional* callback on success - read more below
    fail:         onAuthorizeFail    // *optional* callback on fail/error - read more below
}));


function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');

  console.log('data', data);
  console.log('accept', accept);
  accept();
}


function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);

  console.log('failed connection to socket.io:', message);
  console.log('error', error)

  // If you don't want to accept the connection
  if(error)
    accept(new Error(message));
  // this error will be sent to the user as a special error-package
  // see: http://socket.io/docs/client-api/#socket > error-object
}




io.on('connection', function(socket){
    console.log('server is emit: user:connection');
    io.emit('user:connection', 'user:CONNECT');

    socket.on('disconnect', function () {
        io.emit('user:disconnect', 'user:DISCONNECT');
    });
});






// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    var hash = {
        provider:       user['provider'],
        providerId:     user['id'],
        displayName:    user['displayName'],
        photos:         user['photos']
    }
    done(null, hash);
});

passport.deserializeUser(function(obj, done) {

    User.findOne({providerId: obj['providerId']}, function(err, dbUser) {
        var hash = {
            _id:            dbUser['_id'],
            provider:       obj['provider'],
            providerId:     obj['providerId'],
            displayName:    obj['displayName'],
            photos:         obj['photos']
        }

        onlineUsers.add(hash);
console.log(
        'onlineUsers.all', onlineUsers.all()
        );
        io.emit('user:connection', hash);

        done(err, hash);
    });
});

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

var users = [];
// Keep track of users
var onlineUsers = (function () {

    return {
        add: function(user){
            var i = users.indexOf(user.providerId);
            if ( users.indexOf(user.providerId) == -1 ){
                users.push(user.providerId);
            }
            return users;
        },
        remove: function(user){
            var i = users.indexOf(user.providerId);
            if ( users.indexOf(user.providerId) == -1 ){
                users.slice(i, 1);
            }
            return users;
        },
        all: function(){
            return users;
        }
  };
}());

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({

    // TODO Have the callbackURL rely on yaml settings
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"

}, function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

        User.find({providerId: profile.id}, function(err, user) {
            if (err) throw err;
            // object of the user

            if (user.length == 0) {
                var u       = new User();
                u.provider  = profile.provider;
                u.providerId= profile.id;
                u.firstName = profile.name.givenName;
                u.lastName  = profile.name.familyName;
                u.photos    = profile.photos;
                u.save(function(err, user) {
                    if (err) console.log('err', err);
                });
            }

        });

        return done(null, profile);
    });
}
));






// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }), function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



app.get('/', function(req, res){
        if (req.user != undefined) {
            res.sendFile(__dirname + '/retro.html');
        }
        else {
            res.sendFile(__dirname + '/index.html');
        }
    })

app.get('/chat', function(req, res){
        res.sendFile(__dirname + '/frontend/chat.html');
});

app.get('/retros', function(req, res){
    Retro.find().populate('_creator').exec(function(err, retros) {
        if (err) res.send(err);
        res.json(retros);
    });
});

app.get('/retros/:id', function (req, res){


    Retro.findById(req.params.id).populate('_creator').exec(function(err, retro) {
        if (err) res.send(err);
        res.json(retro);
    });
});

    app.delete('/retros/:id', ensureAuthenticated, function (req, res){
        Retro.remove({_id: req.params.id}, function(err, retro) {
            if (err) res.send(err);
            res.json({message: 'Successfully deleted' });
        });
    })

    .post('/retros', ensureAuthenticated, function(req, res) {

        User.findById(req.user._id, function(err, currentUser) {

            if (err) res.send(err);

            console.log('currentUser', currentUser._id)
            var r       = new Retro();
            r.title     = req.body.title;
            r.form      = req.body.form;
            r._creator  = currentUser._id;

            r.save(function(err, retro) {
                if (err) res.send(err);
                res.json({retro: {_id: retro._id, title: retro.title, form: retro.form, firstName: retro._creator.firtName} });
            });


        });

    })

    .post('/responses', ensureAuthenticated, function(req, res) {
        var r = new Response();
        r.retro_id = req.body.retro_id;
        r.input = req.body.input;
        r.save(function(err, response) {
            if (err) res.send(err);
            res.json({retro: {_id: response._id, retro_id: response.retro_id, input: response.input} });
        });
    });

    app.get('/responses', ensureAuthenticated, function (req, res){
        Response.find({retro_id: req.query.retro_id}, function(err, responses) {
            if (err) res.send(err);
            res.json({responses: responses});
        });
    });




// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}



