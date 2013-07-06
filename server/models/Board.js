Backbone = require('backbone');

var Board = Backbone.Model.extend({

    defaults : {
        x : 50,
        y : 50,
        cellWidth : 10,
        cellHeight : 10
    }

});

module.exports = Board;