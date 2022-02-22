import React from 'react';
import ReactDOM from 'react-dom';
import {store} from './redux/store'
import { Provider } from 'react-redux'
import Routes from './routes'


import Performance from './component/Performance'


ReactDOM.render(
  <div>
    <Provider store={store}>
      <Routes />
    </Provider>
    <Performance />
  </div>,
  document.getElementById('root')
);

