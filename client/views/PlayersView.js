(function () {
    "use strict";

    Game.PlayersView = Backbone.View.extend({

        initialize : function (options) {
            this.ctx = options.ctx;
            this.players = options.players;
            this.board = options.board;
            this.listenTo(this.players, 'reset', this.render);
        },

        color : function (player) {
            return player.get('username') === Game.username ? "#00FEFF" : "#FF0065";
        },

        draw : function () {
            var self = this;
            var cellWidth = this.board.get('cellWidth');
            var cellHeight = this.board.get('cellHeight');

            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.players.each(function (player) {
                this.ctx.fillStyle = self.color(player);
                _.each(player.get('parts'), function (part) {
                    this.ctx.fillRect(part.x * cellWidth, part.y * cellHeight, cellWidth, cellHeight);
                }, this);
            }, this);
        },

        render : function () {
            requestAnimationFrame(_.bind(this.draw, this));
        }

    });

}());