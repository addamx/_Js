import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import reducer from './reducers'
import App from './components/App'



const store = createStore(
  reducer
  /* applyMiddleware(...middleware) */
);
/* 初始化state */
//store.dispatch()
/* store api */
console.log(store.getState());


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
