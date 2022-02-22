import SelectPeopleService from "@service/select-people-service";

/**
 * init select people component
 */
// 业务组件
import SelectPeople from "@components/biz-components/select-people";
// 业务Model
import SelectPeopleModel from "@model/select-people";
// 注册业务事件
EventBus.register(["select_people_inited", "select_people_changed"]);
// 业务订阅事件
const SelectPeopleEvents = {
  contracts_changed: {
    handler: ({ contracts }) => {
      // 范式化：不存在则中止
      const contractId = contracts[0].contract_id;
      if (!contractId) return;
      // TODO: 是否需要data-transformer这类转换器？如果要，在哪声明？使用的地方太多（主要是订阅事件处）怎么办？
      return SelectPeopleService.getFlowByContractId(contractId).then(res => {
        dispatchEvent("SelectPeople_Changed", res);
      });
    }
  }
};

const componentConfig = {
  name: "SelectPeople",
  // vuex state, mutation
  model: SelectPeopleModel,
  view: SelectPeople,
  // vuex action
  events: SelectPeopleEvents
};
