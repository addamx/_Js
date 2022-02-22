import { createStore } from 'redux';
import { combineReducers } from 'redux'

import {getProducts} from '../service/shop'

/**
 * Action
 */

const fetchProducts = () => {
  return async (dispatch) => {
    try {
      await getProducts(() => {
        dispatch(save_products)
      })
    } catch (err) {

    }
  }
}

const save_products = (data) => {
  return {
    type: 'save_products',
    data
  }
}

//reducers
const product = (state, action) => {
  switch (action.type) {
    case 'change_title':
      return Object.assign({}, state, action.title);
    case 'add_product':
      return action.product;
    default:
      return state;
  }
}
const products = (state = [], action) => {
  switch (action.type) {
    case 'get_porducts':
      return [...state];
    case 'add_product':
      return [...state, product(undefined, action)]
    case 'change_title':
      return state.map(pd => product(pd, action));
    default:
      return state;
  }
}

const shop = (state = 'doit', action) => {
  return state;
}


const store = createStore(
  combineReducers({
    products,
    shop
  })
);

store.subscribe(() =>
    console.log(store.getState())
);

const actions = {
  fetchProducts
}

export {
  store,
  actions
};