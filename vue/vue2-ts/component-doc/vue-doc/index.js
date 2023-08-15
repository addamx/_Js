const { transformFromAstSync } = require("@babel/core");
const parser = require("@babel/parser");
const plugin = require("./plugin");
const fs = require("fs");
const path = require("path");

const vueFileCode = fs.readFileSync(path.join(__dirname, "./sourceCode.vue"), {
  encoding: "utf-8",
});

const scriptMatchRes = vueFileCode.match(/<script[^>]*?>([\s\S]*?)<\/script>/);
if (!scriptMatchRes) return;
const scriptContent = scriptMatchRes[1];

const ast = parser.parse(scriptContent, {
  plugins: ["typescript"],
  sourceType: "unambiguous",
});

const { code } = transformFromAstSync(ast, scriptContent, {
  plugins: [plugin],
  filename: "vue-script.ts",
});
