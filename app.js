/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var _ = require('underscore');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/client", express.static(path.join(__dirname, 'client')));

app.set('view engine', 'hbs');

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    res.redirect("/" + _.uniqueId("anonymous"));
});

app.get('/:username', function (req, res) {
    res.render('index', {username : req.route.params.username });
});


var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);

var GameServer = require('./server/GameServer');
var gameServer = new GameServer({io : io});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});