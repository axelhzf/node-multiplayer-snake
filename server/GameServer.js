var _ = require('underscore');
var Backbone = require('Backbone');
var Board = require('./models/Board');
var Player = require('./models/Player');
var Players = require('./models/Players');
var FoodCollection = require('./models/FoodCollection');

module.exports = function (io) {

    var board = new Board();
    var players = new Players();
    var foodCollection = new FoodCollection();

    var updateData = function (options) {
        var data = {};
        if (options.players) {
            data.players = players.toJSON();
        }
        if (options.food) {
            data.food = foodCollection.toJSON();
        }
        if (options.board) {
            data.board = board.toJSON();
        }
        return data;
    };


    var gameLoop = function () {
        players.invoke('movePosition');
        var data = updateData({players : true, food : true});
        players.each(function (player) {
            player.get('socket').emit('update', data);
        });
    };

    setInterval(gameLoop, 100);

    var addFood = function () {
        var x = _.random(0, board.get('x'));
        var y = _.random(0, board.get('y'));
        foodCollection.add({x : x, y : y});
    };

    setInterval(addFood, 3000);


    io.sockets.on('connection', function (socket) {
        players.add({socket : socket, board : board});

        socket.emit('update', updateData({board : true, players : true, food : true}));

        socket.on('disconnect', function () {
            var player = players.get(socket.id);
            if (player) {
                players.remove(player);
            }
        });

    });

};