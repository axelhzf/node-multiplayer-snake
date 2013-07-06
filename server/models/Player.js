var Backbone = require('Backbone');
var _ = require('underscore');

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
        var board = this.get('board');

        this.attributes.parts.pop();
        var newPart = _.clone(this.attributes.parts[0]);

        newPart.x = newPart.x + this.attributes.direction.x;
        newPart.y = newPart.y + this.attributes.direction.y;

        // control game limits
        if (newPart.x < 0) {
            newPart.x = board.get('x');
        } else if (newPart.x > board.get('x')) {
            newPart.x = 0;
        }

        if (newPart.y < 0) {
            newPart.y = board.get('y');
        } else if (newPart.y > board.get('y')) {
            newPart.y = 0;
        }

        this.attributes.parts.unshift(newPart);
    },

    toJSON : function () {
        return {
            id : this.id,
            parts : this.attributes.parts,
            direction : this.attributes.direction
        };
    }

});

module.exports = Player;