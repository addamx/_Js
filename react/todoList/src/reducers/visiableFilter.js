const initalState = "SHOW_ALL"

const visiableFilter = (state = initalState, action) => {
  switch (action.type) {
    case 'SET_VISIABLE_FILTER':
      return action.filter
    default:
      return state;
  }
}

export default visiableFilter;
