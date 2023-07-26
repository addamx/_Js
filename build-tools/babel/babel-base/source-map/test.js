const { SourceMapGenerator } = require("source-map");

const sourceMap = new SourceMapGenerator({
  file: "source-mapped.js",
});

sourceMap.addMapping({
  generated: {
    line: 10,
    column: 35,
  },
  source: "foo.js",
  original: {
    line: 33,
    column: 2,
  },
  name: "christopher",
});

console.log(JSON.stringify(sourceMap.toJSON(), null, 4));
