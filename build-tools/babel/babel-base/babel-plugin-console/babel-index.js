// @ts-check
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

const sourceCode = `const a = 1;
console.log('hello world')`;

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx']
});

traverse(ast, {
  CallExpression(path, state) {
    if (types.isMemberExpression(path.node.callee)) {
      // @ts-ignore
      if (path.node.isNew) {
        return;
      }
      const { object, property } = path.node.callee;
      if (
        // 1. 通过判断对象和属性名
        types.isIdentifier(object, { name: 'console' }) && types.isIdentifier(property, { name: 'log' })
        // 2. 通过generate-code匹配
        || (generate(path.node.callee).code === 'console.log')
        // 3. toString 匹配
        || path.get('callee').toString()  === 'console.log'
        // 4. matchesPattern 匹配（命中 console.log 和 console['log']）
        || (path.get('callee').matchesPattern('console.log'))
      ) {
        // path.node.callee = types.identifier('print'); // console.log替换为print
        if (path.node.loc) {
          const { line, column } = path.node.loc.start;
          // path.node.arguments.unshift(types.stringLiteral(`filename: (line: ${line}, column: ${column})`));

          const newNode = template.expression(`console.log('filename: (line: ${line}, column: ${column})')`)();
          // @ts-ignore
          newNode.isNew = true; // 添加标识以便跳过

          if (path.findParent(path => path.isJSXElement())) {
            path.replaceWith(types.arrayExpression([newNode, path.node]));
            path.skip();
          } else {
            path.insertBefore(newNode);
          }
        }

      }
    }
  }
})

const { code, map } = generate(ast);
console.log(code);
