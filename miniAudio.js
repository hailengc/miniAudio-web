var MiniAudio = (function() {
  function MA(containerId, options) {
    this.elemRoot = document.getElementById(containerId);
    this.elemPlayer = this.elemRoot.querySelector(".ma-player");
    this.elemAudio = this.elemRoot.querySelector(".ma-audio");
    this.elemAudio.loop = options && options.loop === true;
    this.init();
  }

  function _addClickListener(selector, listener) {
    this.elemRoot
      .querySelector(".button-play img")
      .addEventListener("click", listener);
  }

  MA.prototype.init = function() {
    _addClickListener.call(this, ".button-play img", this.play.bind(this));
  };

  MA.prototype.stop = function() {
    this.elemAudio.currentTime = 0;
    this.elemAudio.pause();
  };

  MA.prototype.play = function() {
    this.elemAudio.play();
  };

  MA.prototype.pause = function() {
    this.elemAudio.pause();
  };

  MA.prototype.volumeChange = function(v) {
    var newVoulum = this.elemAudio.volume + v;
    if (newVoulum < 0 || newVoulum > 1) {
      return;
    }
    this.elemAudio.volume = newVoulum;
  };

  return MA;
})();
