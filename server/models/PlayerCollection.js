var Backbone = require('backbone');
var Player = require('./Player');

var Players = Backbone.Collection.extend({
    model : Player
});

module.exports = Players;