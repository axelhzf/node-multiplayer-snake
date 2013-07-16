var _ = require('underscore');
var Board = require('./models/Board');
var PlayerCollection = require('./models/PlayerCollection');
var FoodCollection = require('./models/FoodCollection');

var GameServer = function (options) {
    this.initialize(options);
};

GameServer.prototype = {

    initialize : function (options) {
        this.io = options.io;

        this.board = new Board();
        this.players = new PlayerCollection();
        this.foodCollection = new FoodCollection();

        this.updateDataFields = {players : true};  //information to send on the next update event

        this.bindModelEvents();
        this.bindSocketsEvents();
    },

    bindModelEvents : function () {
        var self = this;

        var includeScores = function () {
            self.updateDataFields.scores = true;
        };
        this.players.on('add', includeScores);
        this.players.on('remove', includeScores);
        this.players.on('change:score', includeScores);

        var includeFood = function () {
            self.updateDataFields.food = true;
        };
        this.foodCollection.on('add', includeFood);
        this.foodCollection.on('remove', includeFood);
        this.players.on('add', includeFood);

        this.players.on('add', function () {
            self.updateDataFields.board = true;
        });
    },

    bindSocketsEvents : function () {
        var self = this;
        this.io.sockets.on('connection', function (socket) {
            socket.on('addPlayer', _.bind(self.onSocketAddPlayer, self, socket));
            socket.on('disconnect', _.bind(self.onSocketDisconnect, self, socket));
            socket.on('keydown', _.bind(self.onSocketKeydown, self, socket));
        });
    },

    onSocketAddPlayer : function (socket, username) {
        this.players.add({username : username, socket : socket, board : this.board});
        if (this.players.length === 1) {
            this.startIntervals();
        }
    },

    onSocketDisconnect : function (socket) {
        var player = this.players.get(socket.id);
        if (player) {
            this.players.remove(player);
        }
        if (this.players.length === 0) {
            this.stopIntervals();
        }
    },

    onSocketKeydown : function (socket, key) {
        var player = this.players.get(socket.id);
        player.set('lastKey', key);
    },

    detectCollisions : function () {
        var playersParts = this.players.pluck('parts');

        var heads = _.map(playersParts, function (parts) {
            return _.first(parts);
        });

        //Collisions
        _.each(heads, function (head, i) {
            var collidedFood = this.foodCollection.find(function (food) {
                return head.x === food.get('x') && head.y === food.get('y');
            });

            if (collidedFood) {
                this.foodCollection.remove(collidedFood);
                this.players.at(i).eat();
            }

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
                this.players.at(i).die();
            }

        }, this);
    },

    updateData : function () {
        var data = {};
        if (this.updateDataFields.players) {
            data.players = this.players.toJSON();
        }
        if (this.updateDataFields.food) {
            data.food = this.foodCollection.toJSON();
        }
        if (this.updateDataFields.board) {
            data.board = this.board.toJSON();
        }
        if (this.updateDataFields.scores) {
            data.scores = this.players.invoke("pick", "username", "score", "maxScore");
        }
        this.updateDataFields = {players : true};
        return data;
    },

    gameLoop : function () {
        this.players.invoke('movePosition');
        this.detectCollisions();
        var data = this.updateData();

        this.players.each(function (player) {
            player.get('socket').emit('update', data);
        });
    },

    addFood : function () {
        if (this.foodCollection.length < 10) {
            var x = _.random(0, this.board.get('x') - 1);
            var y = _.random(0, this.board.get('y') - 1);
            this.foodCollection.add({x : x, y : y});
        }
    },

    startIntervals : function () {
        this.stopIntervals();
        console.log("start intervals");
        this.gameLoopIntervalesId = setInterval(_.bind(this.gameLoop, this), 100);
        this.addFoodIntervalId = setInterval(_.bind(this.addFood, this), 3000);
    },

    stopIntervals : function () {
        console.log("stop intervals");

        if (this.gameLoopIntervalesId) {
            clearInterval(this.gameLoopIntervalesId);
        }

        if (this.addFoodIntervalId) {
            clearInterval(this.addFoodIntervalId);
        }
    }

};

module.exports = GameServer;
