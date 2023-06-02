// @ts-check
const postcssValurParser = require('postcss-value-parser');

/**
 * @typedef {import('postcss').Plugin} PostCSSPlugin
 * @typedef {import('postcss').ProcessOptions} ProcessOptions
 */

/**
 * 插件名称
 *
 * @type {string}
 */
const PLUGIN_NAME = 'postcss-import-parser';

/**
 * 插件选项
 *
 * @typedef {Object} PluginOptions
 * @property {string[]} imports 外部记录收集到的资源地址
 */

/**
 * PostCSS 插件函数
 * @param {PluginOptions} options - 插件选项
 * @returns {PostCSSPlugin} - PostCSS 插件
 */
function plugin(options) {
  const { imports } = options;
  // 返回 PostCSS 插件函数
  return {
    postcssPlugin: PLUGIN_NAME,
    // 可以快速访问css如@media，@import等@定义的节点（type为atRule）
    AtRule(atRule, postcss) {
      const {nodes: paramsNodes} = postcssValurParser(atRule.params);
      const url = paramsNodes.find(
        (node) => node.type === 'string' && node.value
      )?.value;
      if (url) {
        imports.push(url);
        atRule.remove();
      }
    },
  };
}

// 标记插件为 PostCSS 插件
plugin.postcss = true;

// 导出插件函数
module.exports = plugin;
