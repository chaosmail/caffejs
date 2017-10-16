namespace Parser {

  export abstract class BinaryParser {

    constructor() {
      
    }

    protected fetch(url: string) {
      var req = new Request(url);
      return fetch(req).then((response) => response.arrayBuffer());
    }

    public parse(url: string) {
      return this.fetch(url).then((response) => this.parseBuffer(response));
    }

    abstract parseBuffer(raw: ArrayBuffer);
  }
}
