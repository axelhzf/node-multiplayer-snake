/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));

app.set('view engine', 'hbs');

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    res.render('index', {title : 'TLP2k13'})
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);
//io.set('log level', 1);

require('./server/GameServer')(io);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});