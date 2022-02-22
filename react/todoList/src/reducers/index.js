import { combineReducers } from 'redux'
import todoList from './todoList'
import visiableFilter from './visiableFilter'

/**
state = {
  todoList,
  visiableFilter
}
 */

const todoApp = combineReducers({
  todoList,
  visiableFilter
});

export default todoApp;
