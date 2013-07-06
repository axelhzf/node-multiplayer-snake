/* global $,_ , Backbone */
(function () {
    "use strict";

    var Game = window.Game = {};


    Game.main = function (el) {
        this.$el = $(el);
        this.board = new Backbone.Model();
        this.players = new Backbone.Collection();
        this.food = new Backbone.Collection();

        this.boardCanvasCtx = this.$el.find('.boardCanvas')[0].getContext("2d");
        this.playersCanvasCtx = this.$el.find('.playersCanvas')[0].getContext("2d");
        this.foodCanvasCtx = this.$el.find('.foodCanvas')[0].getContext("2d");

        this.boardCanvasView = new Game.BoardView({ctx : this.boardCanvasCtx, board : this.board});
        this.playersView = new Game.PlayersView({ctx : this.playersCanvasCtx, players : this.players, board : this.board});
        this.foodView = new Game.FoodView({ctx : this.foodCanvasCtx, board : this.board, food : this.food});

        var socket = io.connect('http://localhost');
        var self = this;

        socket.on('update', function (data) {

            if (data.board) {
                self.board.set(data.board);
            }

            if (data.players) {
                self.players.set(data.players);
            }

            if (data.food) {
                self.food.set(data.food);
            }

        });


        var controls = new Game.Controls();
        controls.on('keydown', function (key) {
            socket.emit('keydown', key);
        });

        controls.start();
    };




//    KEYBOARD controls
//    if (Game.controls.keys.LEFT && this.direction.y) {
//        this.direction = {x : -1, y : 0};
//    } else if (Game.controls.keys.RIGHT && this.direction.y) {
//        this.direction = {x : 1, y : 0};
//    } else if (Game.controls.keys.UP && this.direction.x) {
//        this.direction = {x : 0, y : -1};
//    } else if (Game.controls.keys.DOWN && this.direction.x) {
//        this.direction = {x : 0, y : 1};
//    }

}());



