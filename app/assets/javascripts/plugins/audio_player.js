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
  var $trackLink = this.find('.track-link');
  
  var $progressBar = this.find('.progress');

  var currentTrack = null;
  var queue = [];
  
  var comments = [];
  var currentComment = null;

  var remoteOptions = null;  
  
  var animator = null;
  var audioContext = null;
  var analyzer = null;
  var analyzing = false;
  
  var resetRemote = function () {
    if (!remoteOptions) {
      return;
    }
    
    remoteOptions.$progressBar.css("background", "");
    window.cancelAnimationFrame(animator);
      
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
      currentComment = comment;
      currentComment.line.addClass("active");
      
      var $commentBubble = $('<div>').
        addClass("progress-comment").
        text(currentComment.comment.get("content"));
        
      var offset = remoteOptions.$progressBar.children('.progress-bar').width();
      
      remoteOptions.$progressBar.prepend($commentBubble);
        
      if (currentComment.comment.get("track_timestamp") < audio.duration / 2) {
        $commentBubble.css("left", offset);
      } else {
        $commentBubble.css("left", offset - $commentBubble.width() - 12);
        $commentBubble.css("border-radius", "0 10px")
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
    $trackLink.text(currentTrack.title);
    $trackLink.attr("href", currentTrack.link);
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
    console.log("set remote options")
    
    $audio.one("loadeddata", function () {
      var x = remoteOptions.$progressBar.find('.progress-bar').width();     
      this.seek(x, remoteOptions.$progressBar.width());
    }.bind(this));
    
    $audio.one("timeupdate", function () {
      this.prepareAnalyzer();
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
    if (!analyzing) {
      audioContext = new webkitAudioContext();
      analyzer = audioContext.createAnalyser();
    }

    analyzer.fftSize = 2048;
    // var bufferLength = analyzer.fftSize;
    var bufferLength = analyzer.frequencyBinCount;
    var buffer = new Uint8Array(bufferLength);
    
    var $bar = remoteOptions.$progressBar;
    var canvasWidth = $bar.width(),
        canvasHeight = $bar.height();
    
    var canvasContext = document.getCSSCanvasContext(
      '2d', 'visualizer', canvasWidth, canvasHeight
    );
    
    if (!analyzing) {
      audioContext.createMediaElementSource(audio).connect(analyzer);
      analyzer.connect(audioContext.destination);
    }
    
    $bar.css("background", "-webkit-canvas(visualizer)");
    
    analyzing = true;
    
    var gradient = canvasContext.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(1,    'hsl(200, 65%, 93%)');
    gradient.addColorStop(0.75, 'hsl(200, 70%, 85%)');
    gradient.addColorStop(0.25, 'hsl(200, 75%, 75%)');
    gradient.addColorStop(0,    'hsl(200, 80%, 65%)');
    
    _renderAnalyzer();
    
    function _renderAnalyzer() {
      animator = window.requestAnimationFrame(_renderAnalyzer);
      
      analyzer.getByteFrequencyData(buffer);
      // analyzer.getByteTimeDomainData(buffer);
    
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      canvasContext.fillStyle = gradient;

      for(var x = 0; x < canvasWidth; ++x) {
        var i = Math.floor(x * (bufferLength / canvasWidth));
        var height = (buffer[i] * .0035) * canvasHeight;

        canvasContext.fillRect(x, canvasHeight, 1, -height);
      }
      
      // canvasContext.lineWidth = 4;
      // canvasContext.strokeStyle = gradient;
      // canvasContext.beginPath();
      //
      // var sliceWidth = canvasWidth * 1.0 / bufferLength;
      // var x = 0;
      //
      // for (var i = 0; i < bufferLength; ++i) {
      //   var v = buffer[i] / 128.0;
      //   var y = v * canvasHeight / 2;
      //
      //   if (i === 0) {
      //     canvasContext.moveTo(x, y);
      //   } else {
      //     canvasContext.lineTo(x, y);
      //   }
      //
      //   x += sliceWidth;
      // }
      //
      // canvasContext.lineTo(canvasWidth, canvasHeight / 2);
      // canvasContext.stroke();
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