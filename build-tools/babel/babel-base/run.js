// @ts-check
const { transformFileSync } = require("@babel/core");
const babelPluginConsole = require("./babel-plugin-console");
const path = require("path");

const res = transformFileSync(path.resolve(__dirname, "./src/source.js"), {
  plugins: [babelPluginConsole],
  sourceMaps: true,
  parserOpts: {
    sourceType: "unambiguous",
    plugins: ["jsx"],
  },
});

if (res) {
  const { code } = res;
  console.log(code);
}
