/**
 * 处理异常
 * @param {string} desc
 * @param {object} option 包含两个选项
 * pops 是否调用面包屑组件提示，默认为false
 * silent 测试环境是否不抛出异常，默认为false
 *
 * 默认方式：
 * 测试环境, 抛出异常
 * 生产环境, 通过log输出
 */
const _throw = (desc, option = {}) => {
  if (desc instanceof Object) {
    desc = JSON.stringify(desc);
  }
  desc = typeof desc === "string" ? desc : "未知错误";

  const { pops = false, silent = false } = option;

  if (process.env.NODE_ENV === "development" && false === silent) {
    throw new Error(desc);
  } else {
    console.error(JSON.stringify(desc));

    if (true === pops) {
      // ... 处理全局调用
    }
  }
};

export default _throw;
