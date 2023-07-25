# JS Parser 历史
- Mozilla发布最早的JS parser -- esprima，基于SpiderMonkey的AST标准，后来形成estree标准【https://github.com/estree/estree/blob/master/es5.md】
- acorn基于estree标准，速度更快，支持通过插件实现语法支持
- eslint的parser -- espree 以及 babel的 parser都是基于 acorn
- 从babel4以后，babel fork了acorn来修改，不再依赖acorn，但原理相似


# API
## AST 别名（Aliases）
- 参考 node_modules/@babel/types/lib/index.d.ts 的 interface Aliases ，可以看到Aliases所包含的AST类型


## generator
- 了解如何构建各类ast节点 https://github.com/babel/babel/tree/main/packages/babel-generator/src/generators 