import React from 'react'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

//withRouter: 增强React组件, 使它能访问`history`对象和它的Route子组件的`match`
//一般为了给Route组件添加功能
export default withRouter(ScrollToTop)
