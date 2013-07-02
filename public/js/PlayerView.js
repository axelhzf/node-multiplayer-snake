/* global $,_ , Backbone, Game */
(function () {
    "use strict";

    Game.PlayerView = Backbone.View.extend({

        initialize : function (options) {
            this.ctx = options.ctx;
        },

        renderPart : function (part) {
            this.ctx.fillStyle = "blue";
            this.ctx.fillRect(part.x * Game.grid, part.y * Game.grid, Game.grid, Game.grid);
            this.ctx.strokeStyle = "white";
            this.ctx.strokeRect(part.x * Game.grid, part.y * Game.grid, Game.grid, Game.grid);
        },

        render : function (dt) {
            _.each(this.model.get('parts'), this.renderPart, this);
        }

    });

}());