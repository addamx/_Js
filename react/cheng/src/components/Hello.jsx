import React, { Component } from 'react'

export default class Hello extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h5>Props</h5>
        <ul>
          <li>initValue: { this.props.initValue }</li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    )
  }
}

Hello.defaultProps = {
  initValue: 11
}

