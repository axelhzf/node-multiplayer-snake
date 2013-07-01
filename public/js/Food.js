/* global $,_ , Backbone, Game */

(function () {
    "use strict";

    Game.Food = Backbone.View.extend({

        initialize : function (options) {
            this.ctx = options.ctx;
            this.x = options.x;
            this.y = options.y;
        },

        step : function () {

        },

        render : function () {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.x * Game.grid, this.y * Game.grid, Game.grid, Game.grid);
        }

    });


}());