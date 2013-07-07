Game.FoodView = Backbone.View.extend({

    initialize : function (options) {
        this.ctx = options.ctx;
        this.board = options.board;
        this.food = options.food;

        this.listenTo(this.food, "reset", this.render);
    },

    draw : function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        var cellWidth = this.board.get('cellWidth');
        var cellHeight = this.board.get('cellHeight');

        this.ctx.fillStyle = "#D8FD06";
        this.food.each(function (f) {
            var x = f.get('x');
            var y = f.get('y');
            this.ctx.fillRect(x * cellWidth + 0.5, y * cellHeight + 0.5, cellWidth, cellHeight );
        }, this);
    },

    render : function () {
        requestAnimationFrame(_.bind(this.draw, this));
    }

});