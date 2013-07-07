(function () {
    "use strict";

    Game.PlayerView = Backbone.View.extend({

        initialize : function (options) {
            this.ctx = options.ctx;
            this.board = options.board;
        },

        color : function () {
            return this.model.get('username') === Game.username ? "#00FEFF" : "#FF0065";
        },

        renderPart : function (part) {
            this.ctx.fillStyle = this.color();
            var cellWidth = this.board.get('cellWidth');
            var cellHeight = this.board.get('cellHeight');
            this.ctx.fillRect(part.x * cellWidth, part.y * cellHeight, cellWidth, cellHeight);
        },

        render : function () {
            _.each(this.model.get('parts'), this.renderPart, this);
        }

    });


    Game.PlayersView = Backbone.View.extend({

        initialize : function (options) {
            this.ctx = options.ctx;
            this.players = options.players;
            this.board = options.board;

            this.playerViewContainer = new Backbone.ChildViewContainer();

            this.listenTo(this.players, 'add', this.onAddPlayer);
            this.listenTo(this.players, 'remove', this.onRemovePlayer);
            this.listenTo(this.players, 'change', this.render, this);
        },

        onAddPlayer : function (model) {
            var playerView = new Game.PlayerView({model : model, ctx : this.ctx, board : this.board});
            this.playerViewContainer.add(playerView);

            this.render();
        },

        onRemovePlayer : function (model) {
            var playerView = this.playerViewContainer.findByModel(model);
            if (playerView) {
                this.playerViewContainer.remove(playerView);
            }

            this.render();
        },

        draw : function () {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.playerViewContainer.each(function (playerView) {
                playerView.render();
            });
        },

        render : function () {
            requestAnimationFrame(_.bind(this.draw, this));
        }

    });

}());