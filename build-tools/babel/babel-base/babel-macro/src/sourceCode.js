const files = require("../macros/files.macro");

console.log("src files:");
console.log(files("../src"));
console.log("babel-macro files:");
console.log(files("../macros"));
