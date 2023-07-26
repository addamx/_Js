const { codeFrameColumns } = require("@babel/code-frame");

const res = codeFrameColumns(
  `'use strict';
  const a = 1;
  const b = 2`,
  {
    start: { line: 2, column: 1 },
    end: { line: 3, column: 5 },
  },
  {
    highlightCode: true,
    message: "这里有一个错误",
  },
);

console.log(res);
