import React, { Component } from 'react'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux';

/**
 * http://qingbob.com/redux-performance-01-basic/
 *
 * 避免列表全部渲染的方法:
 * 1. shouldComponentUpdate
 * 2. 让 item 的 state 直接关联 store
 *
 * 注意事项:
 * 1. 不要使用这样的赋值 `options={this.props.options || []}` 否则可能每次都是赋值新空数组
 * 2. 在事件中使用新建的函数: `onClick={this.update.bind(this)}` 或 `onClick={() => {console.log('test')}}`
 * 这些事件函数都被当作新函数(对象), 将引起重复渲染;
 */

const markItem = id => ({id, type: 'MARK'})

const initState = [];
for(let i = 0; i < 10; i++) {
  initState.push({id: i})
}

const itemReducer = (state = {}, action) => {
  switch(action.type) {
    case 'MARK':
      return {...state, marked: !state.marked};
    default:
      return state;
  }
}

const itemsReducer = (state = initState, action) => {
 switch(action.type) {
    case 'MARK':
      return state.map((item) =>
        action.id === item.id ? itemReducer(item, action) : item
      )
    default:
      return state;
 }
}

const store = (initialState) => {
  return createStore(
    itemsReducer,
    initialState
  );
}

class Item extends Component {
  /**
   * [1] 减少列表全部重新渲染
   */
  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.marked !== nextProps.marked
  // }
  render() {
    // console.log(this.props)
    console.log('render: ' + this.props.id)
    return (
      <li  onClick={() => this.props.markItem(this.props.item.id)}>{this.props.item.id} - {JSON.stringify(this.props.item.marked)}</li>
    )
  }
}
/**
 * [2] 让item 直接关联 store中的state
 */
var mapStateToProps = (state, props) => ({
  item: state[props.id] //props 正常从items中向下传递
})
var mapDispatchToProps = (dispatch, ownProps) => {
  return {
    markItem: (id) => {
      dispatch(markItem(id))
    }
  }
};
const ReItem = connect(mapStateToProps, mapDispatchToProps)(Item);



class Items extends Component {
  doit() {
    console.log('testEvent')
  }
  render() {
    const { items, markItem } = this.props;
    return (
      <ul>
        {
          items.map((item, index) => (
            <ReItem key={item.id} id={item.id} /> //event={() => {}}, 或者this.doit.bind(this)每次传入新值, 将引起item重复渲染
          ))
        }
      </ul>
    )
  }
}



var mapStateToProps = (state) => ({
  items: state
})

const ReItems = connect(mapStateToProps)(Items);


export default () => (
  <div>
    <hr />
    <h5>阻止列表重复渲染</h5>
    <Provider store={store()}>
      <ReItems />
    </Provider>
  </div>
)

