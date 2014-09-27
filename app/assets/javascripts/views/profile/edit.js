WavPool.Views.ProfileEdit = Backbone.View.extend({
  template: JST["profile/edit"],
  
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
        
        WavPool.alerter.flashNow({
          context: "success",
          message: "You have successfully updated your profile."
        });
      },
      
      error: function (profile, response) {        
        WavPool.alerter.flashNow({
          context: "danger",
          message: response.responseJSON
        });
      }
    });
  },

  render: function () {
    var renderedContent = this.template({
      profile: this.model
    });

    this.$el.html(renderedContent);
    
    WavPool.bindUploadField({
      fileTypes: /(\.|\/)(jpe?g|png|gif)$/i,
      $fileInput: this.$('.upload-field'),
      $previewEl: this.$('.upload-preview')
    });

    return this;
  }
});