const parser = require("@babel/parser");
const { codeFrameColumns } = require("@babel/code-frame");
const chalk = require("chalk");

const sourceCode = `
const a = 2;
function add(a, b) {
  return a + b;
}
console.log(add(1, 2));
`;

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
});

class Scope {
  constructor(parentScope) {
    this.parent = parentScope;
    this.declarations = {};
  }
  set(name, value) {
    this.declarations[name] = value;
  }
  getLocal(name) {
    return this.declarations[name];
  }
  get(name) {
    let res = this.getLocal(name);
    if (res === undefined && this.parent) {
      res = this.parent.get(name);
    }
    return res;
  }
  has(name) {
    return !!this.getLocal(name);
  }
}

const evaluator = (() => {
  const astInterpreters = {
    Program(node, scope) {
      // VariableDeclaration: const a = 2;
      // FunctionDeclaration: function add(a, b) { return a + b; }
      // ExpressionStatement: console.log(add(1, 2));
      for (const childNode of node.body) {
        evaluate(childNode, scope);
      }
    },
    VariableDeclaration(node, scope) {
      for (const decl of node.declarations) {
        evaluate(decl, scope);
      }
    },
    VariableDeclarator(node, scope) {
      // 'a'
      const declareName = evaluate(node.id);
      if (scope.get(declareName)) {
        throw Error("duplicate declare variable：" + declareName);
      } else {
        scope.set(declareName, evaluate(node.init, scope));
      }
    },
    ExpressionStatement(node, scope) {
      return evaluate(node.expression, scope);
    },
    MemberExpression(node, scope) {
      const object = scope.get(evaluate(node.object));
      const property = evaluate(node.property, scope);
      return object[property];
    },
    FunctionDeclaration(node, scope) {
      const declareName = evaluate(node.id);
      if (scope.get(declareName)) {
        throw Error("duplicate declare function：" + declareName);
      } else {
        scope.set(declareName, function (...args) {
          const funcScope = new Scope();
          funcScope.parent = scope;

          node.params.forEach((param, index) => {
            // 函数参数加入作用域
            funcScope.set(param.name, args[index]);
          });
          funcScope.set("this", this);
          return evaluate(node.body, funcScope);
        });
      }
    },
    ReturnStatement(node, scope) {
      return evaluate(node.argument, scope);
    },
    BlockStatement(node, scope) {
      for (const childNode of node.body) {
        const res = evaluate(childNode, scope);
        if (childNode.type === "ReturnStatement") {
          // 如果是returnStatement，需要返回结果
          return res;
        }
      }
    },
    // console.log(add(1, 2)))
    // add(1, 2)
    CallExpression(node, scope) {
      const args = node.arguments.map((item) => {
        if (item.type === "Identifier") {
          return scope.get(item.name);
        }
        return evaluate(item, scope);
      });
      if (node.callee.type === "MemberExpression") {
        const fn = evaluate(node.callee, scope);
        const calleeObj = node.callee.object;
        let obj = evaluate(calleeObj, scope);
        // 一般 callObj 是 Identifier，但是也有可能是其他类型，如`({say: function(){console.log('hello')}).say()`的type是ObjectExpression `(new User()).say()`的是NewExpression
        obj = calleeObj.type === "Identifier" ? scope.get(obj) : obj;
        return fn.apply(obj, args);
      } else {
        const fn = scope.get(node.callee.name, scope); // else 则为 Identifier，到作用域找到对应的函数声明
        return fn(...args);
      }
    },
    BinaryExpression(node, scope) {
      const leftValue = getIdentifierValue(node.left, scope);
      const rightValue = getIdentifierValue(node.right, scope);
      switch (node.operator) {
        case "+":
          return leftValue + rightValue;
        case "-":
          return leftValue - rightValue;
        case "*":
          return leftValue * rightValue;
        case "/":
          return leftValue / rightValue;
        default:
          throw Error(node.operator + " is not supported");
      }
    },
    Identifier(node, scope) {
      return node.name;
    },
    NumericLiteral(node, scope) {
      return node.value;
    },
  };

  function getIdentifierValue(node, scope) {
    return node.type === "Identifier"
      ? scope.get(node.name)
      : evaluate(node, scope);
  }

  function evaluate(node, scope) {
    try {
      return astInterpreters[node.type](node, scope);
    } catch (error) {
      if (
        ~error?.message?.indexOf("astInterpreters[node.type] is not a function")
      ) {
        console.error("unsupported ast type: " + node.type);
        console.error(
          codeFrameColumns(sourceCode, node.loc, {
            highlightCode: true,
          }),
        );
      } else {
        console.error(node.type + ":", error.message);
        console.error(
          codeFrameColumns(sourceCode, node.loc, {
            highlightCode: true,
          }),
        );
      }
    }
  }

  return { evaluate };
})();

const globalScope = new Scope();
globalScope.set("console", {
  log(...args) {
    console.log(chalk.green(...args));
  },
  error(...args) {
    console.log(chalk.red(...args));
  },
  warn(...args) {
    console.log(chalk.orange(...args));
  },
});

evaluator.evaluate(ast.program, globalScope);
