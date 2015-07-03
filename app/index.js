var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var app         = express();
var server      = require('http').createServer(app);
var io          = require('socket.io')(server);
var mongoose    = require('mongoose');

app.use(morgan('dev'));

mongoose.connect('mongodb://localhost/retro');
var Retro     = require('./backend/models/retro');
var Response     = require('./backend/models/response');
var Response     = require('./backend/models/user');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('app/public'));

app
    .get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
    })
    .get('/chat', function(req, res){
        res.sendFile(__dirname + '/chat.html');
    })

    .get('/retros/new', function(req, res){
        res.sendFile(__dirname + '/new.html');
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

    .delete('/retros/:id', function (req, res){
        Retro.remove({_id: req.params.id}, function(err, bear) {
            if (err) res.send(err);
            res.json({message: 'Successfully deleted' });
        });
    })

    .post('/retros', function(req, res) {
        var r = new Retro();
        r.title = req.body.title;
        r.form = req.body.form;
        r.save(function(err, retro) {
            if (err) res.send(err);
            res.json({retro: {_id: retro._id, title: retro.title, form: retro.form} });
        });
    })

    .post('/responses', function(req, res) {
        var r = new Response();
        r.retro_id = req.body.retro_id;
        r.input = req.body.input;
        r.save(function(err, response) {
            if (err) res.send(err);
            res.json({retro: {_id: response._id, retro_id: response.retro_id, input: response.input} });
        });
    })

    .get('/responses', function (req, res){
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
