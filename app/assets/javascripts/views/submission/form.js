WavPool.Views.SubmissionForm = Backbone.View.extend({
  template: JST["submission/form"],
  
  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
  },
  
  events: {
    "submit form": "onSubmit"
  },
  
  onSubmit: function (event) {
    event.preventDefault();
    
    var params = $(event.currentTarget).serializeJSON().submission;
    
    var callbacks = {
      success: function (submission) {
        WavPool.alerter.flash({
          context: "success",
          message: "Track update was successful."
        });

        Backbone.history.navigate(
          "#/submissions/" + submission.id,
          { trigger: true }
        );
      },
      
      error: function (submission, response) {
        WavPool.alerter.flashNow({
          context: "danger",
          message: response.responseJSON
        });

        this.model.set(submission.attributes);
      }.bind(this),
      
      wait: true
    };
    
    if (this.model.isNew()) {
      this.collection.create(params, callbacks);
    } else {
      this.model.save(params, callbacks);
    }
  },

  render: function () {
    var renderedContent = this.template({
      submission: this.model
    });

    this.$el.html(renderedContent);
    
    WavPool.bindUploadField({
      fileTypes: /(\.|\/)(mp3|wav|aiff)$/i,
      $fileInput: this.$('.submission-upload'),
      $progressBar: this.$('.submission-progress'),
      autoUpload: true
    });

    WavPool.bindUploadField({
      fileTypes: /(\.|\/)(jpe?g|png|gif)$/i,
      $fileInput: this.$('.sub-image-upload'),
      $previewEl: this.$('.sub-image-preview')
    });

    return this;
  }
});