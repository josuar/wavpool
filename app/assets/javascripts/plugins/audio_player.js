$.fn.audioPlayer = function () {
  if (this.length > 1) {
    return this.each(function() {
      $(this).audioPlayer();
    });
  }

  var $audio = this.find('audio');
  var audio = $audio.get(0);

  var $playToggle = this.find('.play-toggle');
  var $playButton = $playToggle.find('span');

  var $prevTrack = this.find('.prev-track');
  var $nextTrack = this.find('.next-track');
  var $trackTitle = this.find('.track-title');
  
  var $progressBar = this.find('.progress');

  var currentTrack = null;
  var queue = [];
  var currentComment = null;

  var remoteOptions = null;  
  
  // var animator = null;
  
  var resetRemote = function () {
    if (!remoteOptions) {
      return;
    }
      
    resetPlayToggle();
      
    remoteOptions.reset();
    
    this.remoteOptions = null;
  };
  
  var resetPlayToggle = function () {
    remoteOptions.$playButton
      .find('span')
      .removeClass("glyphicon-pause")
      .addClass("glyphicon-play");
  };
  
  var onTrackEnded = function (event) {
    $progressBar.children('.progress-bar').css("width", 0);
    remoteOptions.$progressBar.children('.progress-bar').css("width", 0);
    resetPlayToggle();
    // resetRemote();
  };

  var setPlayButton = function ($el) {
    if (audio.paused) {
      $el.removeClass("glyphicon-pause");
      $el.addClass("glyphicon-play");
    } else {
      $el.removeClass("glyphicon-play");
      $el.addClass("glyphicon-pause");
    }
  };

  var onAudioPlayPause = function (event) {
    setPlayButton($playButton);

    if (remoteOptions) {
      setPlayButton(remoteOptions.$playButton.find('span'));
    }
  };

  var onPlayToggle = function (event) {
    event.preventDefault();

    if (audio.paused) {
      play();
    } else {
      pause();
    }
  };

  var updateProgressBar = function ($bar) {
    var maxWidth = $bar.width();
    var newWidth = Math.floor((audio.currentTime / audio.duration) * maxWidth);

    $bar.children('.progress-bar').css("width", newWidth);
  };

  var onTimeUpdate = function (event) {
    updateProgressBar($progressBar);

    if (remoteOptions) {
      updateProgressBar(remoteOptions.$progressBar);
      processComments();
    }
  };
  
  var processComments = function () {
    if (!remoteOptions.comments || currentComment) {
      return;
    }
    
    var comment = remoteOptions.comments[Math.floor(audio.currentTime)];
    
    if (comment) {
      currentComment = comment[0];
      currentComment.line.addClass("active");
      
      var $commentBubble = $('<div>').
        addClass("progress-comment").
        text(currentComment.comment.get("content"));
        
      var offset = remoteOptions.$progressBar.children('.progress-bar').width();
      
      remoteOptions.$progressBar.prepend($commentBubble);
        
      if (currentComment.comment.get("position") < 50) {
        $commentBubble.css("left", offset);
      } else {
        $commentBubble.css("left", offset - $commentBubble.width() - 20);
      }
      
      _.delay(function () {
        currentComment.line.removeClass("active");
        currentComment = null;
        
        $commentBubble.remove();
      }, 3000);
    }
  };

  var play = function () {
    if (!currentTrack) {
      return;
    }

    audio.play();
  };

  var pause = function () {
    if (!currentTrack) {
      return;
    }

    audio.pause();
  };

  var render = function () {
    $trackTitle.text(currentTrack.title);
  };

  var processQueue = function () {
    currentTrack = queue.shift();

    if (!currentTrack) {
      return;
    }

    $audio.attr("src", currentTrack.url);
    render();

    audio.load();
    play();
  };
  
  var onProgressClick = function (event) {    
    this.seek(event.offsetX, $progressBar.width());
  }.bind(this);
  
  this.seek = function (x, seekWidth) {
    if (!currentTrack) {
      return;
    }
    
    audio.currentTime = Math.floor(x * (audio.duration / seekWidth));
  };

  this.bindRemote = function (options) {
    resetRemote();
    remoteOptions = options;
    
    $audio.one("loadeddata", function () {
      var x = remoteOptions.$progressBar.find('.progress-bar').width();     
      this.seek(x, remoteOptions.$progressBar.width());
      //this.prepareAnalyzer();
    }.bind(this));

    updateProgressBar(remoteOptions.$progressBar);
    setPlayButton(remoteOptions.$playButton.find('span'));
  };

  this.enqueueTrack = function (track) {
    queue.push(track);
  };

  this.playTrack = function (track) {
    queue.unshift(track);
    processQueue();
  };

  this.togglePlayState = function () {
    if (audio.paused) {
      play();
    } else {
      pause();
    }
  };

  this.submissionId = function () {
    if (currentTrack) {
      return currentTrack.id;
    }
    
    return 0;
  };
  
  this.duration = function () {
    if (!currentTrack) {
      return 0;
    }
    
    return audio.duration;
  };
  
  this.timestamp = function () {
    if (!currentTrack) {
      return 0;
    }
    
    return Math.floor(audio.currentTime);
  };
  
  this.prepareAnalyzer = function () {      
    var $canvas = remoteOptions.$analyzer;
    var canvas = $canvas.get(0);
    
    var audioContext = new webkitAudioContext();
    var analyzer = audioContext.createAnalyser();
    
    analyzer.fftSize = 2048;
    var bufferLength = analyzer.fftSize;
    var buffer = new Uint8Array(bufferLength);
    
    var canvasContext = canvas.getContext('2d');
    
    audioContext.createMediaElementSource(audio).connect(analyzer);
    analyzer.connect(audioContext.destination);
    
    _renderAnalyzer();
    
    function _renderAnalyzer() {
      animator = window.requestAnimationFrame(_renderAnalyzer);
      
      //analyzer.getByteFrequencyData(buffer); 
      analyzer.getByteTimeDomainData(buffer);
    
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.fillStyle = '#00CCFF';
      
      canvasContext.lineWidth = 4;
      canvasContext.strokeStyle = "#00CCFF";
      canvasContext.beginPath();

      var sliceWidth = canvas.width * 1.0 / bufferLength;
      var x = 0;

      for (var i = 0; i < bufferLength; ++i) {
        var v = buffer[i] / 128.0;
        var y = v * canvas.height / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.stroke();
      
      // bars = canvas.width / 3;
      //
      // for (var i = 0; i < bars; ++i) {
      //   var x = i * 3;
      //
      //   if (x < remoteOptions.$progressBar.children('.progress-bar').width()) {
      //     canvasContext.fillStyle = '#22CCFF';
      //   } else {
      //     canvasContext.fillStyle = '#00CCFF';
      //   }
      //
      //   var width = 2;
      //   var height = -(buffer[i] / 4);
      //
      //   canvasContext.fillRect(x, canvas.height, width, height);
      // }
    };
  };

  this.initialize = function () {
    $audio.on("play", onAudioPlayPause);
    $audio.on("pause", onAudioPlayPause);

    $audio.on("timeupdate", onTimeUpdate);
    $audio.on("ended", onTrackEnded);

    $playToggle.on("click", onPlayToggle);
    $progressBar.on("click", onProgressClick);

    return this;
  };

  return this.initialize();
};