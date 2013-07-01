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

        var gameObjects = [];

        var snake = new Game.Player({ctx : ctx});
        var food = new Game.Food({ctx : ctx, x : 20, y : 20});
        gameObjects.push(snake);
        gameObjects.push(food);

        var lastTime = 0;
        var mainLoop = function (time) {
            var dt = time - lastTime;

            if (dt > Game.speed) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                var i;
                for (i = 0; i < gameObjects.length; i++) {
                    gameObjects[i].step(dt);
                }
                for (i = 0; i < gameObjects.length; i++) {
                    gameObjects[i].render(dt);
                }
                lastTime = time;
            }
        };

        (function animloop (dt) {
            requestAnimationFrame(animloop);
            mainLoop(dt);
        })();
    };

}());



