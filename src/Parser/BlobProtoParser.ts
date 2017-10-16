/// <reference path="./BinaryprotoParser.ts" />
/// <reference path="../Net/_module.ts" />

namespace Parser {

  export class BlobProtoParser extends BinaryprotoParser {

    parseProto(rawData: ArrayBuffer, protoParser: any) {
      // Decode the protobuf data
      var blob = protoParser.BlobProto.decode(rawData);

      var sx = blob.width, sy = blob.height, depth = blob.channels;
      var data = blob.data;

      // Generate a new Vol from the blob data
      var vol = new Net.Vol(sx, sy, depth, 0.0);
      
      for (let d = 0; d < depth; d++) {
        for (let y = 0; y < sy; y++) {
          for (let x = 0; x < sx; x++) {
            var ix = ((sy * d) + y) * sx + x;
            vol.set(x, y, d, data[ix]);
          }
        }
      }
      return vol;
    }
  }
}