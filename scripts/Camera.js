var Camera = (function Camera(){

  function Camera(elem, width, height, frequency) {

    this.width = width || 160;
    this.height = height || 120;
    this.frequency = frequency || 1000;
    this.runnnig = false;
    this.dispatch = d3.dispatch('stream');

    Webcam.attach(elem);
    Webcam.set({
      width: this.width,
      height: this.height
    });
  }

  Camera.prototype.snap = function() {
    Webcam.snap((function(data_uri, canvas, ctx) {
      // Read the data from the canvas object
      var img = ctx.getImageData(0, 0, this.width, this.height);

      // Dispatch the event
      this.dispatch.stream(img);

      if (this.runnnig) {
        this.performStream();
      }
    }).bind(this));
  }

  Camera.prototype.performStream = function() {
    this.runnnig = true;
    setTimeout(this.snap.bind(this), this.frequency);
  }

  Camera.prototype.on = function(event, callbackFn) {
    this.dispatch.on(event, callbackFn);
  }

  Camera.prototype.stream = function(cb, frequency) {
    this.dispatch.on('stream', cb);
    this.frequency = frequency || this.frequency;
    this.performStream();
  }

  return Camera;
})();