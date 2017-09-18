import {TextParser} from './TextParser';

export default class PrototxtParser extends TextParser {

  parseString(raw: string){
    return this.parsePrototxt(raw);
  }

  parsePrototxt(raw: string, level: number = 0) {
    var json = {};
    var match;

    if (level == 0) {
      var regexVal = /(?:^|\n)(\w+):\s"*([\w/.]+)"*/gi;
      var regexObj = /(?:^|\n)(\w+)\s\{([\S\s]*?)\n\}/gi;
    }
    else {
      let indent = '(?:^|\\n)\\s{' + level + '}';
      let key = '(\\w+)';
      var regexVal = new RegExp(indent + key + '\\s*:\\s*"*([\\w/.]+)"*', "gi");
      var regexObj = new RegExp(indent + key + '\\s*\\{\\s*\\n([\\s\\S]*?)\\n\\s{' + level + '}\\}', "gi");
    }

    while (match = regexVal.exec(raw)) {
      let key = match[1];
      let value = match[2];
      if (json[key] !== undefined) {
        if (Array.isArray(json[key])) {
          json[key].push(value);
        }
        else {
          json[key] = [json[key]];
          json[key].push(value);
        }
      }
      else {
        json[match[1]] = value;
      }
    }

    while (match = regexObj.exec(raw)) {
      let key = match[1];
      let value = this.parsePrototxt(match[2], level + 2);

      if (json[key] !== undefined) {
        if (Array.isArray(json[key])) {
          json[key].push(value);
        }
        else {
          json[key] = [json[key]];
          json[key].push(value);
        }
      }
      else {
        json[key] = value;
      }
    }

    return json;
  }
}