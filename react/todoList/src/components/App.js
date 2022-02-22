import React from 'react';
import VisibleTodoList from '../containers/VisiableTodoList'
import AddTodo from '../containers/AddTodo'
import Footer from './Footer'


const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App;
