import React from 'react';
import { connect } from 'react-redux'
import { addTodo } from '../actions'


let AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={
        (e) => {
          e.preventDefault()
          let text = input.value.trim();
          if (!text) return;
          dispatch(addTodo(text))
          input.value= ''
        }
      }>
        <input ref={node => {input = node}} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}

/**
 * 只注入 dispatch，不监听 store
 * >AddTodo 将获得 dispatch
 * >不需要mapStateToProps, 因为这个组件不需要订阅store, 只需要负责提交action
 */
AddTodo = connect()(AddTodo)

export default AddTodo
