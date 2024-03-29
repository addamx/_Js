import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisiableTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter (t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter (t => !t.completed)
    default:
      throw new Error('Unknow filter: ' + filter)
  }
}

const mapStateToProps = (state) => ({
  todoList: getVisiableTodos(state.todoList, state.visiableFilter)
})

const mapDispatchToProps = {
  onTodoClick: toggleTodo
}

const visiableTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default visiableTodoList;
