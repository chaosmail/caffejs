var Camera = (function Camera(){

  function Camera(elem, width, height, frequency) {

    this.width = width || 160;
    this.height = height || 120;
    this.frequency = frequency || 1000;
    this.runnnig = true;
    this.dispatch = d3.dispatch('stream');

    Webcam.attach(elem);
    Webcam.set({
      width: this.width,
      height: this.height
    });
  }

  Camera.prototype.step = function() {
    Webcam.snap((function(data_uri, canvas, ctx) {
      // Read the data from the canvas object
      var img = ctx.getImageData(0, 0, this.width, this.height);
      
      // Extract the data
      var data = {};
      data.R = img.data.filter(function(d, i){
        return i % 4 === 0;
      });
      data.G = img.data.filter(function(d, i){
        return i % 4 === 1;
      });
      data.B = img.data.filter(function(d, i){
        return i % 4 === 2;
      });
      data.A = img.data.filter(function(d, i){
        return i % 4 === 3;
      });

      // Dispatch the event
      this.dispatch.stream(data);

      if (this.runnnig) {
        this.performStream();
      }
    }).bind(this));
  }

  Camera.prototype.performStream = function() {
    setTimeout(this.step.bind(this), this.frequency);
  }

  Camera.prototype.stream = function(cb, frequency) {
    this.dispatch.on('stream', cb);
    this.frequency = frequency || this.frequency;
    this.performStream();
  }

  return Camera;
})();