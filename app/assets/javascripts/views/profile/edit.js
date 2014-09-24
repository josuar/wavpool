WavPool.Views.ProfileEdit= Backbone.View.extend({
	template: JST["profile/edit"],
  
  className: "col-xs-8 col-xs-offset-2",
  
  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
  },
  
  events: {
    "submit form": "onSubmit"
  },
  
  onSubmit: function (event) {
    event.preventDefault();
    
    var params = $(event.currentTarget).serializeJSON().profile;
    
    this.model.save(params, {
      success: function (model) {
        $('#profile-display-name').text(model.escape('display_name'));
        
        WavPool.alert({
          context: "success",
          message: "You have successfully updated your profile."
        });
           
      }.bind(this),
      
      error: function (profile, response) {        
        _(response.responseJSON).each(function (error) {
          WavPool.alert({
            context: "danger",
            message: error
          });
        });
      }
    });
  },

  render: function () {
    var renderedContent = this.template({
      profile: this.model
    });

    this.$el.html(renderedContent);

    return this;
  }
});