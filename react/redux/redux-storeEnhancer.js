const doNothingEnhancer = (createStore) => (reducer, preloadedState, enhancer) => {
  const store = createStore(reducer, preloadedState, enhancer);
  return store;
};

//这里的createStore参数未必是Redux默认的createStore函数，因为多个增强器也可以组合使用，所以这里接收到的createStore参数可能是已经被另一个增强器改造过的函数。
//一个store对象中包含下列接口：   •dispatch   •subscribe   •getState   •replaceReducer. 每一个接口都可以被修改，当然，无论如何修改，最后往往还是要调用原有对应的函数。
