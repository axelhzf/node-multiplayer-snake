/* global $,_ , Backbone, Game */

(function () {
    "use strict";

    Game.Snake = Backbone.View.extend({

        initialize : function (options) {
            this.ctx = options.ctx;
            this.parts = options.parts;
            this.direction = options.direction;
        },



    });

}());