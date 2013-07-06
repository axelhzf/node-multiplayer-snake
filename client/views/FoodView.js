Game.FoodView = Backbone.View.extend({

    initialize : function (options) {
        this.ctx = options.ctx;
        this.board = options.board;
        this.food = options.food;

        this.listenTo(this.food, "add", this.render);
        this.listenTo(this.food, "remove", this.render);
    },

    draw : function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        var cellWidth = this.board.get('cellWidth');
        var cellHeight = this.board.get('cellHeight');

        this.ctx.fillStyle = "red";
        this.food.each(function (f) {
            var x = f.get('x');
            var y = f.get('y');

            var radius = (cellWidth / 2) - 1; //margin
            var centerX = x * cellWidth +  (cellWidth / 2) + 0.5;
            var centerY = y * cellHeight + (cellWidth / 2) + 0.5;
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        }, this);
        this.ctx.fill();
    },

    render : function () {
        requestAnimationFrame(_.bind(this.draw, this));
    }

});