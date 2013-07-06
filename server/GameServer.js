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

    var detectCollisions = function () {
        var playersParts = players.pluck('parts');

        var heads = _.map(playersParts, function (parts) {
            return _.first(parts);
        });

        //Fod collisions
        _.each(heads, function (head, i) {
            var collidedFood = foodCollection.find(function (food) {
                return head.x === food.get('x') && head.y === food.get('y');
            });
            if(collidedFood) {
                foodCollection.remove(collidedFood);
                players.at(i).eat();
            }
        });

        _.each(heads, function (head, i) {
            var collidedPlayer = _.find(playersParts, function (parts, j) {
                if (i === j) {
                    parts = parts.slice(1);
                }
                var collidedPart = _.find(parts, function (part) {
                    return head.x === part.x && head.y === part.y;
                });
                return !_.isUndefined(collidedPart);
            });

            if (collidedPlayer) {
                 players.at(i).die();
            }

        });

    };

    var gameLoop = function () {
        players.invoke('movePosition');
        detectCollisions();

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

        socket.on('keydown', function (key) {
            var player = players.get(socket.id);
            player.set('lastKey', key);
        });

    });

};