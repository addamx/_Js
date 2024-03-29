/**
 * @user monkeywang
 * @author muwoo
 * Date: 2018/6/6
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const {transformFromAst} = require('@babel/core');

let config = {}

/**
 * 获取文件，解析成ast语法
 * @param filename
 * @returns {*}
 */
function getAst (filename) {
  const content = fs.readFileSync(filename, 'utf-8')

  return parser.parse(content, {
    sourceType: 'module',
  });
}

/**
 * 根据 ast 生成依赖关系数组
 * @param {*} ast
 */
function getDependence (ast) {
  let dependencies = []
  traverse(ast, {
    ImportDeclaration: ({node}) => {
      dependencies.push(node.source.value);
    },
  })
  return dependencies
}

/**
 * 编译 ast 生成代码
 * @param ast
 * @returns {*}
 */
function getTranslateCode(ast) {
  const {code} = transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  });
  return code
}

/**
 * 从 filename 生成 依赖关系映射
 * @param fileName
 * @param entry
 * @returns {{fileName: *, dependence, code: *}}
 */
function parse(fileName, entry) {
  let filePath = fileName.indexOf('.js') === -1 ? fileName + '.js' : fileName
  let dirName = entry ? '' : path.dirname(config.entry)
  let absolutePath = path.join(dirName, filePath)
  const ast = getAst(absolutePath)
  return {
    fileName,
    dependence: getDependence(ast),
    code: getTranslateCode(ast),
  };
}

/**
 * 获取深度队列依赖关系
 * @param main
 * @returns {*[]}
 */
function getQueue(main) {
  let queue = [main]
  for (let asset of queue) {
    asset.dependence.forEach(function (dep) {
      let child = parse(dep)
      queue.push(child)
    })
  }
  return queue
}

function bundle(queue) {
  console.log("bundle -> queue", queue)
  let modules = ''
  queue.forEach(function (mod) {
    modules += `'${mod.fileName}': function (require, module, exports) { ${mod.code} },`
  })

  const result = `(function(modules) {
    function require(fileName) {
      const fn = modules[fileName];
      const module = { exports : {} };
      fn(require, module, module.exports);
      return module.exports;
    }
    require('${config.entry}');
  })({${modules}})
  `;

  // We simply return the result, hurray! :)
  return result;
}

function bundleFile(option) {
  config = option
  let mainFile = parse(config.entry, true)

  let queue = getQueue(mainFile)
  return bundle(queue)
}

module.exports = bundleFile
