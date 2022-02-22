/**
 *
 */
export default class Injectable {
  /**
   *
   * @param {String} token
   * @param {Function} Creator 类
   */
  constructor(token, Creator) {
    this.token = token;
    this.Creator = Creator;
    this.cache = null;
    this.dependencies = [];
  }
}
