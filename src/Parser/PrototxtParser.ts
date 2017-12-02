/// <reference path="./TextParser.ts" />

namespace Parser {
  
  // declare variables
  declare var prototxtParser: any;

  export class PrototxtParser extends TextParser {

    parseString(raw: string){
      return prototxtParser.parse(raw);
    }
  }
}
