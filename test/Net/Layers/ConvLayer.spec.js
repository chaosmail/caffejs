describe("ConvLayer", function() {

  // Create an input layer
  var _in = new Net.Layers.InputLayer({
    width: 128, height: 128, depth: 3
  });

  describe("constructor", function(){

    var opt = {filters: 3, sx: 3, stride: 1, pad: 0, pred: [_in]};
    
    it("should initialize filters", function() {
      
      var layer = new Net.Layers.ConvLayer(opt);

      var actual = layer.filters.length;
      var expected = 3;

      expect(actual).toEqual(expected);
    });
  });
});