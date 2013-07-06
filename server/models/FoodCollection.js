var Backbone = require('Backbone');
var Food = require('./Food');

var FoodCollection = Backbone.Collection.extend({

    model : Food

});

module.exports = FoodCollection;