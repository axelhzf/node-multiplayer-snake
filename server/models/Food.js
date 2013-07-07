Backbone = require('backbone');

var Food = Backbone.Model.extend({

    defaults : {
        x : 0,
        y : 0
    },

    toJSON : function () {
        return {
            id : this.cid,
            x : this.attributes.x,
            y : this.attributes.y
        };
    }

});

module.exports = Food;