import '@babel/polyfill'

import * as React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import Counter from './components/Counter'
import reducer from './reducers'
import rootSaga from './sagas'

/**
 * 配置redux Saga
 */
const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
/**
 * 动态地运行 saga
 * middleware.run(saga, ...args), saga必须是一个返回Generator对象的函数
 */
sagaMiddleware.run(rootSaga)

const action = type => store.dispatch({ type })

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => action('INCREMENT')}
      onDecrement={() => action('DECREMENT')}
      onIncrementIfOdd={() => action('INCREMENT_IF_ODD')}
      onIncrementAsync={() => action('INCREMENT_ASYNC')}
      onTestEffect={() => action('TEST_EFFECT')}
      onLoginRequest={() => action('LOGIN_REQUEST')}
      onLogOut={() => action('LOGOUT')}
    />,
    document.getElementById('root'),
  )
}

render()
store.subscribe(render)
