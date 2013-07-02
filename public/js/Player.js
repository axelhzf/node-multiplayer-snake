/* global $,_ , Backbone, Game */

(function () {
    "use strict";

    Game.Player = Backbone.Model.extend({

        defaults : {
            parts : [],
            direction : {x : 1, y : 0}
        }

    });

}());