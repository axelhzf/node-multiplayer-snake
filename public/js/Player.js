/* global $,_ , Backbone, Game */

(function () {
    "use strict";

    Game.Player = Game.Snake.extend({

        initialize : function () {
            Game.Snake.prototype.initialize.apply(this, arguments);
            Game.controls.on("keydown", this.keydown, this);
        },

        keydown : function () {
            if (Game.controls.keys.LEFT && this.direction.y) {
                this.direction = {x : -1, y : 0};
            } else if (Game.controls.keys.RIGHT && this.direction.y) {
                this.direction = {x : 1, y : 0};
            } else if (Game.controls.keys.UP && this.direction.x) {
                this.direction = {x : 0, y : -1};
            } else if (Game.controls.keys.DOWN && this.direction.x) {
                this.direction = {x : 0, y : 1};
            }
        }

    });

}());