WavPool.Views.AudioPlayer = Backbone.View.extend({
  template: JST['audio_player'],

  initialize: function (options) {
    this.audio = this.$('audio')[0];

    console.log(this.audio);

    this.$playToggle = this.$('.play-toggle');
    this.$playButton = this.$playToggle.find('span');
    this.$innerProgress = this.$('.progress-bar');

    //this.$outerProgress = options.$progress;

    this.queue = [];
  },

  events: {
    "click .play-toggle" : "onPlayToggle",
    "ended #global-player" : "onTrackEnded"
  },

  onTrackEnded: function (event) {
    this._processQueue();
  },

  onPlayToggle: function () {
    if (this.audio.paused) {
      this._play();
      this.$playButton.removeClass("glyphicon-play");
      this.$playButton.addClass("glyphicon-pause");
    } else {
      this._pause();
      this.$playButton.removeClass("glyphicon-pause");
      this.$playButton.addClass("glyphicon-play");
    }
  },

  enqueue: function (track) {
    this.queue.push(track);
  },

  play: function (track) {
    this.queue.unshift(track);
    this._processQueue();
  },

  _processQueue: function () {
    this.currentTrack = this.queue.shift();

    if (!this.currentTrack) {
      // todo: reset stuff
      return;
    }

    this._setTrackText(
      this.currentTrack.artist + " - " + this.currentTrack.title
    );

    this.audio.attr("src", this.currentTrack.url);
    this._play();
  },

  _setTrackText: function (text) {

  },

  _play: function () {
    this.audio.play();
  },

  _pause: function () {
    this.audio.pause();
  },

  render: function () {
    var renderedContent = this.template({});

    this.$el.html(renderedContent);

    return this;
  }
});