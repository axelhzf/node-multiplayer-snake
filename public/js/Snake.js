/* global $,_ , Backbone, Game */

(function () {
    "use strict";

    Game.Snake = Backbone.View.extend({

        initialize : function (options) {
            this.ctx = options.ctx;

            this.maxX = (this.ctx.canvas.width / Game.grid) - 1;
            this.maxY = (this.ctx.canvas.height / Game.grid) -1;

            this.parts = [
                {x : 0, y : 0},
                {x : 0, y : 1},
                {x : 0, y : 2},
                {x : 0, y : 3}
            ];
            this.direction = { x : 1, y : 0};
        },

        step : function (dt) {
            this.parts.pop();
            var newPart = _.clone(this.parts[0]);

            newPart.x = newPart.x + this.direction.x;
            newPart.y = newPart.y + this.direction.y;

            // control game limits
            if (newPart.x < 0) {
                newPart.x = this.maxX ;
            } else if (newPart.x > this.maxX) {
                newPart.x = 0;
            }

            if (newPart.y < 0) {
                newPart.y = this.maxY;
            } else if(newPart.y > this.maxY) {
                newPart.y = 0;
            }

            this.parts.unshift(newPart);
        },

        renderPart : function (part) {
            this.ctx.fillStyle = "blue";
            this.ctx.fillRect(part.x * Game.grid, part.y * Game.grid, Game.grid, Game.grid);
            this.ctx.strokeStyle = "white";
            this.ctx.strokeRect(part.x * Game.grid, part.y * Game.grid, Game.grid, Game.grid);
        },

        render : function (dt) {
            _.each(this.parts, this.renderPart, this);
        }

    });

}());