import { init } from "grunt"

export default {
  init(componentList, componentConfig, bizConfig) {
  },
  initStore(componentList) {
    // ...
    return {
      [componentName]: {state: 1}
    };
  },
}