import * as React from 'react'
import PropTypes from 'prop-types'

const Counter = ({ value, onIncrement, onIncrementAsync, onDecrement, onIncrementIfOdd, onTestEffect, onLoginRequest, onLogOut }) => (
  <div>
    <p>
      Clicked: {value} times <button onClick={onIncrement}>+</button> <button onClick={onDecrement}>-</button>{' '}
      <button onClick={onIncrementIfOdd}>Increment if odd</button>{' '}
      <button onClick={onIncrementAsync}>Increment async</button>
    </p>
    <p>
      <button onClick={onTestEffect}>Test Effect</button>
    </p>
    <p>
      <button onClick={onLoginRequest}>Test LoginRequest</button>
      <button onClick={onLogOut}>Test Logout</button>

    </p>
  </div>
)

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrementAsync: PropTypes.func.isRequired,
  onIncrementIfOdd: PropTypes.func.isRequired,
}

export default Counter
