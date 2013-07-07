(function () {
    "use strict";

    Game.ScoresView = Backbone.View.extend({

        initialize : function () {
            this.listenTo(this.collection, "reset", this.render);
        },

        template : _.template("<% _.each(scores, function(score) { %> <tr class='<%= score.class %>'><td><%= score.username %></td><td><%= score.score %></td><td><%= score.maxScore %></td></tr> <% }); %>"),

        render : function () {
            var scores = this.collection.toJSON();
            _.each(scores, function (score) {
                score.class = score.username === Game.username ? "player" : "enemy";
            });
            scores = _.sortBy(scores, function (score) {
                return -score.maxScore;
            });
            this.$el.html(this.template({scores : scores}));
        }
    });

})();