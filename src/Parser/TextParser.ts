export abstract class TextParser {

  constructor() {}

  protected fetch(url: string) {
    var req = new Request(url);
    return fetch(req).then((response) => response.text());
  }

  public parse(url: string) {
    return this.fetch(url).then((response) => this.parseString(response));
  }

  abstract parseString(raw: string);
}