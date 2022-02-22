export default class Module {
  /**
   *
   * @param {String} name
   * @param {Class} service
   * @param {Class} model
   */
  constructor({ name, service, model }) {
    this.name = name;
    this.service = service;
    this.model = model;
  }
  init() {
    console.log(`${this.name}: init`);
  }
}
