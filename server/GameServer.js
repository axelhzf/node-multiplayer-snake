var _ = require('underscore');
var Board = require('./models/Board');
var PlayerCollection = require('./models/PlayerCollection');
var FoodCollection = require('./models/FoodCollection');

module.exports = function (io) {

    var board = new Board();
    var players = new PlayerCollection();
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

        if (options.scores) {
            data.scores = players.invoke("pick", "username", "score", "maxScore");
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
            if (collidedFood) {
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

    var updateInfo = {players : true};

    var gameLoop = function () {
        players.invoke('movePosition');
        detectCollisions();

        var data = updateData(updateInfo);
        players.each(function (player) {
            player.get('socket').emit('update', data);
        });

        updateInfo = {players : true};
    };


    players.on('add', function () {
        updateInfo.scores = true;
    });

    players.on('remove', function () {
        updateInfo.scores = true;
    });

    players.on('change:score', function () {
        updateInfo.scores = true;
    });

    foodCollection.on('add', function () {
        updateInfo.food = true;
    });

    foodCollection.on('remove', function () {
        updateInfo.food = true;
    });


    setInterval(gameLoop, 100);

    var addFood = function () {
        if (foodCollection.length < 10) {
            var x = _.random(0, board.get('x'));
            var y = _.random(0, board.get('y'));
            foodCollection.add({x : x, y : y});
        }
    };

    setInterval(addFood, 3000);


    io.sockets.on('connection', function (socket) {

        socket.on('addPlayer', function (username) {
            players.add({username : username, socket : socket, board : board});
        });

        socket.emit('update', updateData({board : true, players : true, food : true, scores : true}));

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