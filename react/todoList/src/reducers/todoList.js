const initalState = [
  {
    id: 0,
    text: 'test todo',
    completed: false
  },
  //...
]

/**
 * 如果state是多个层级组成, 可以拆分不同reducer针对不同state部分. (甚至分开文件写)
 */

/**
 * @param {Object:"todo"} state
 */
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state
      } else {
        return Object.assign({}, state, {
          completed: !state.completed
        });
      }
    default:
      return state;
  }
}

/**
 * @param {Array:"todoList"} state
 */
const todoList = (state = initalState, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)   //add_todo生成state 没必要获取旧state
      ]
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))
    default:
      return state;
  }
}

export default todoList;
