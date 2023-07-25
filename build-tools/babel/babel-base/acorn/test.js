// ref: https://juejin.cn/book/6946117847848321055/section/6947682728200372232
const acorn = require("acorn");

const Parser = acorn.Parser;
const TokenType = acorn.TokenType;

Parser.acorn.keywordTypes["MY"] = new TokenType("MY", { keyword: "MY" });

function wordsRegexp(words) {
  return new RegExp("^(" + words.replace(/ /g, "|") + ")$");
}

/**
 * @param {typeof acorn.Parser} Parser
 * @returns {Parser}
 */
const myKeyword = function (Parser) {
  return class extends Parser {
    parse(program) {
      let newKeywords =
        "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super";
      newKeywords += " MY";
      this.keywords = wordsRegexp(newKeywords);
      // @ts-ignore
      return super.parse(program);
    }

    parseStatement(context, topLevel, exports) {
      var starttype = this.type;
      if (starttype == Parser.acorn.keywordTypes["MY"]) {
        var node = this.startNode();
        return this.parseMYStatement(node);
      } else {
        return super.parseStatement(context, topLevel, exports);
      }
    }

    parseMYStatement(node) {
      this.next();
      return this.finishNode({ value: "MY" }, "MYStatement"); //新增加的statement语句
    }
  };
};
const newParser = Parser.extend(myKeyword);

var program =
`
    MY
    const a = 1
`;

const ast = newParser.parse(program);
console.log(ast);
