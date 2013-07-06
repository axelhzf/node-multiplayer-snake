var Backbone = require('Backbone');
var Food = require('./Food');

var Foods = Backbone.Collection.extend({

    model : Food

});

module.exports = Foods;