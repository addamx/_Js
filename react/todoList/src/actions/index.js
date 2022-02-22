/**
 * View 中需要传入什么参数, 并产生什么操作才能改变state
 */


let nextTodoId = 1;

export const addTodo = (text) => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
})

export const setVisiableFilter = (filter) => ({
  type: 'SET_VISIABLE_FILTER',
  filter
})
