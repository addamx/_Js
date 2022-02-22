import Form from "./index.vue";
import FormModel from "./model";

/**
 * 组件名
 * Business页面注册用；
 */
export const EDIT_FORM = "EDIT_FORM";
export const Component = Form;

// TODO:
//// DDD: 外界的领域状态
// model: 外界业务联动所能使用的数据模型
// extends base
export default class EditForm {
  name = EDIT_FORM;
  pluginInjected = {};
  model = {};

  constructor({ layoutArr = [], dataModel = {}, relations = {} }) {
    this.model = new FormModel({ layoutArr, dataModel, relations });
  }

  setField(id, prop, value) {
    if (this.model.hasProperty(id) )
    this.model[id][prop] = value;
  }
}

{
  // 提供给 PluginDriver 调用的接口
  pluginInjected: {
    // service 提供
  }
}

ex;
