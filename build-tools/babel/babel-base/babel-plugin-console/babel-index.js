// @ts-check
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");
const template = require("@babel/template").default;

const { babelPlugin } = require("./Plugin");

const sourceCode = `const a = 1;
console.log('hello world')`;

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
});

traverse(ast, {
  CallExpression(path, state) {
    babelPlugin({ generate, types, template }, path);
  },
});

const { code, map } = generate(ast);
console.log(code);
