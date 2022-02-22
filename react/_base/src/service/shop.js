import _products from './products.json'

/**
 * 模拟异步ajax
 */
const TIMEOUT = 100

const getProducts = (cb, timeout) => setTimeout(() => cb(_products), timeout || TIMEOUT)

export {
  getProducts
}