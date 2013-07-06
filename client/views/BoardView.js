(function () {
    "use strict";

    Game.BoardView = Backbone.View.extend({

        initialize : function (options) {
            this.ctx = options.ctx;
            this.board = options.board;
            this.listenTo(this.board, "change", this.render);
        },

        draw : function () {
            var cellWidth = this.board.get('cellWidth');
            var cellHeight = this.board.get('cellHeight');
            var boardWidth = this.board.get('x') * cellWidth;
            var boardHeight = this.board.get('y') * cellHeight;

            for (var x = 0; x <= this.board.get('x'); x++) {
                this.ctx.moveTo(0.5 + x * cellWidth, 0);
                this.ctx.lineTo(0.5 + x * cellWidth, boardHeight);
            }

            for (var y = 0; y <= this.board.get('y'); y++) {
                this.ctx.moveTo(0, 0.5 + y * cellHeight);
                this.ctx.lineTo(boardWidth, 0.5 + y * cellHeight);
            }
            this.ctx.strokeStyle = "#074547";
            this.ctx.stroke();
        },

        render : function () {
            requestAnimationFrame(_.bind(this.draw, this));
        }

    });

}());