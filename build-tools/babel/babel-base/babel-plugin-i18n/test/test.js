const { transformFromAstSync } = require("@babel/core");
const parser = require("@babel/parser");
const plugin = require("../plugin");
const fs = require("fs");
const path = require("path");

const sourceCode = fs.readFileSync(path.join(__dirname, "./sourceCode.js"), {
  encoding: "utf-8",
});

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
});

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      plugin,
      {
        outputDir: path.join(__dirname, "./output"),
      },
    ],
  ],
});

console.log(code);
