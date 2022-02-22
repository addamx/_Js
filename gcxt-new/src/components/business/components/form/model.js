export default class FormModel {
  constructor({ layoutArr = [], dataModel = {}, relations = {} }) {
    this.layoutArr = layoutArr;
    this.dataModel = dataModel;
    this.relations = relations;
  }
}
