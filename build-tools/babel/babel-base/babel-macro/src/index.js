const { transformFileSync } = require("@babel/core");
const path = require("path");

const sourceFilePath = path.resolve(__dirname, "./sourceCode.js");

const { code } = transformFileSync(sourceFilePath, {
  plugins: [["babel-plugin-macros"]],
});

console.log(code);
/*
打印结果：
console.log("src files:");
console.log(["index.js", "sourceCode.js"]);
console.log("babel-macro files:");
console.log(["files.macro.js"]);
*/
