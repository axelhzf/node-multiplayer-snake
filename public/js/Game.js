/* global $,_ , Backbone */
(function () {
    "use strict";

    var Game = window.Game = {};

    Game.speed = 100;
    Game.grid = 10;

    Game.main = function () {
        Game.controls = new Game.Controls();
        Game.controls.start();

        var canvas = $("#canvas")[0];
        var ctx = canvas.getContext("2d");

        var gameViews = new Backbone.ChildViewContainer();

        var players = new Backbone.Collection({
            model : Game.Player
        });

        players.on('add', function (model) {
            var playerView = new Game.PlayerView({model : model, ctx : ctx});
            gameViews.add(playerView);
        });

        players.on('remove', function (model) {
            var playerView = gameViews.findByModel(model);
            if (playerView) {
                gameViews.remove(playerView);
            }
        });

        var lastTime = 0;
        var mainLoop = function (time) {
            var dt = time - lastTime;

            if (dt > Game.speed) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                gameViews.each(function (gameView) {
                    gameView.render(dt);
                });
                lastTime = time;
            }
        };

        (function animloop (dt) {
            requestAnimationFrame(animloop);
            mainLoop(dt);
        })();

        var socket = io.connect('http://localhost');
        socket.on('boardState', function (boardInfo) {
            players.set(boardInfo.players);
        });

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



