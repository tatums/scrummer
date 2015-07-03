var express     = require('express');
var session     = require('express-session')
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var app         = express();
var server      = require('http').createServer(app);
var io          = require('socket.io')(server);
var mongoose    = require('mongoose');
var passport    = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config    = require('yaml-config');
var settings  = config.readConfig('app/config/app.yml')

var GOOGLE_CLIENT_ID = settings.google.client_id;
var GOOGLE_CLIENT_SECRET = settings.google.client_secret;

var sess = {
    secret: 'keyboard cat',
    cookie: {}
};



// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

        console.log('profile', profile)
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        console.log('done', done)

        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
    });
}
));




app.use(morgan('dev'));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost/retro');
var Retro     = require('./backend/models/retro');
var Response     = require('./backend/models/response');
var Response     = require('./backend/models/user');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('app/public'));



// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



app.get('/', function(req, res){
        var sess = req.session

        if (sess.passport.user != undefined) {
            res.sendFile(__dirname + '/retro.html');
        }
        else {
            res.sendFile(__dirname + '/index.html');
        }
    })


    .get('/chat', function(req, res){
        res.sendFile(__dirname + '/chat.html');
    })

    .get('/retros', function(req, res){
        Retro.find(function(err, retros) {
            if (err) res.send(err);
            res.json(retros);
        });
    })

    .get('/retros/:id', function (req, res){
        // TODO - Change this to findOne
        Retro.find({_id: req.params.id}, function(err, retros) {
            if (err) res.send(err);
            res.json(retros[0]);
        });
    })

    .delete('/retros/:id', ensureAuthenticated, function (req, res){
        Retro.remove({_id: req.params.id}, function(err, bear) {
            if (err) res.send(err);
            res.json({message: 'Successfully deleted' });
        });
    })

    .post('/retros', ensureAuthenticated, function(req, res) {
        var sess = req.session
        var r = new Retro();
        r.title = req.body.title;
        r.form = req.body.form;
        r.save(function(err, retro) {
            if (err) res.send(err);
            res.json({retro: {_id: retro._id, title: retro.title, form: retro.form} });
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
    })

    .get('/responses', ensureAuthenticated, function (req, res){
        Response.find({retro_id: req.query.retro_id}, function(err, responses) {
            if (err) res.send(err);
            res.json({responses: responses});
        });
    });






io.on('connection', function(socket){
  socket.on('stuff', function(msg){
    io.emit('stuff', msg);
  });
});

server.listen(3000, function(){
  console.log('listening on *:3000');
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



