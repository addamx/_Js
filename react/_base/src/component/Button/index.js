import React, { Component } from 'react';
import variables from './variables';
import './button.scss';

class Button extends Component {
  render() {
    console.log(variables);
    return (
      <div>
        <button className='button'>Click</button>
      </div>
    );
  }
}

export default Button;
