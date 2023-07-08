export default [
  {
    path: '/home',
    name: 'home',
    component: () => {
      console.log('---router to home')
      return import(/* home-comp */'../views/home.vue')
    },
  },
  {
    path: '/todo',
    name: 'todo',
    component: () => {
      console.log('---router to todo')
      return import(/* todo-comp */'../views/todo.vue')
    }
  },
]
