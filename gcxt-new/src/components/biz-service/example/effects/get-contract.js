import { getContractById } from "@services/contract";

export default {
  /**
   * contract_id: payload, value, option
   */
  deps: ["SET_editForm.contract_id"],
  exec: (commit, store) => {
    const contractIds = commit[0];
    return getContractById(contractIds).then(res => {
      store.contracts = res;
      store.editForm.contract_id.valueObj = res;
      dispatch("SET_contracts", res);
    });
  }
};
