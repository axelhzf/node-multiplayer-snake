var _ = require('underscore');
var Backbone = require('backbone');

module.exports = function (io) {

    var board = {x : 50, y : 50};

    var Player = Backbone.Model.extend({

        initialize : function (attributes, options) {
            var parts = [
                {x : 0, y : 0},
                {x : 0, y : 1},
                {x : 0, y : 2},
                {x : 0, y : 3}
            ];

            var direction = { x : 1, y : 0};

            this.set({
                id : attributes.socket.id,
                parts : parts,
                direction : direction
            });
        },

        movePosition : function () {
            this.attributes.parts.pop();
            var newPart = _.clone(this.attributes.parts[0]);

            newPart.x = newPart.x + this.attributes.direction.x;
            newPart.y = newPart.y + this.attributes.direction.y;

            // control game limits
            if (newPart.x < 0) {
                newPart.x = board.x;
            } else if (newPart.x > board.x) {
                newPart.x = 0;
            }

            if (newPart.y < 0) {
                newPart.y = board.y;
            } else if (newPart.y > board.y) {
                newPart.y = 0;
            }

            this.attributes.parts.unshift(newPart);
        },

        toJSON : function () {
            return {
                id : this.id,
                parts : this.attributes.parts,
                direction : this.attributes.direction
            }
        }

    });

    var Players = Backbone.Collection.extend({
        model : Player
    });

    var players = new Players();

    var gameLoop = function () {
        players.invoke('movePosition');
        var boardState = {
            players : players.map(function (player) {
                return player.toJSON();
            })
        };
        players.each(function (player) {
            player.get('socket').emit('boardState', boardState);
        });
    };

    setInterval(gameLoop, 1000);

    io.sockets.on('connection', function (socket) {
        var player = new Player({socket : socket});
        players.add(player);

        socket.on('disconnect', function () {
            players.remove(player);
        });
    });

    io.sockets.on('disconnect', function (socket) {
        console.log('disconnect');
    });

}