import React from 'react'
import ReactDOM from 'react-dom'

class LifeCycle extends React.Component {
  constructor(props) {
      super(props);
      alert("Initial render");
      alert("constructor");
      this.state = {str: "hello"};
  }

  componentWillMount() {
      alert("componentWillMount");
  }

  componentDidMount() {
      alert("componentDidMount");
  }

  componentWillReceiveProps(nextProps) {
      alert("componentWillReceiveProps");
  }

  shouldComponentUpdate() {
      alert("shouldComponentUpdate");
      return true;        // 记得要返回true
  }

  componentWillUpdate() {
      alert("componentWillUpdate");
  }

  componentDidUpdate() {
      alert("componentDidUpdate");
  }

  componentWillUnmount() {
      alert("componentWillUnmount");
  }

  setTheState() {
      let s = "hello";
      if (this.state.str === s) {
          s = "HELLO";
      }
      this.setState({
          str: s
      });
  }

  forceItUpdate() {
      this.forceUpdate();
  }

  render() {
      alert("render");
      return(
          <div>
              <span>{"Props:"}<h2>{parseInt(this.props.num, 10)}</h2></span>
              <br />
              <span>{"State:"}<h2>{this.state.str}</h2></span>
          </div>
      );
  }
}

class Container  extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          num: Math.random() * 100
      };
  }

  propsChange() {
      this.setState({
          num: Math.random() * 100
      });
  }

  setLifeCycleState() {
      this.refs.rLifeCycle.setTheState();
  }

  forceLifeCycleUpdate() {
      this.refs.rLifeCycle.forceItUpdate();
  }

  unmountLifeCycle() {
      // 这里卸载父组件也会导致卸载子组件
      ReactDOM.unmountComponentAtNode(document.getElementById("container"));
  }

  parentForceUpdate() {
      this.forceUpdate();
  }

  render() {
      return (
          <div>
              <div><a href="javascript:;" className="weui_btn weui_btn_primary" onClick={this.propsChange.bind(this)}>propsChange</a></div>
              <div><a href="javascript:;" className="weui_btn weui_btn_primary" onClick={this.setLifeCycleState.bind(this)}>setState</a></div>
              <div><a href="javascript:;" className="weui_btn weui_btn_primary" onClick={this.forceLifeCycleUpdate.bind(this)}>forceUpdate</a></div>
              <div><a href="javascript:;" className="weui_btn weui_btn_primary" onClick={this.unmountLifeCycle.bind(this)}>unmount</a></div>
              <div><a href="javascript:;" className="weui_btn weui_btn_primary" onClick={this.parentForceUpdate.bind(this)}>parentForceUpdateWithoutChange</a></div>
              <LifeCycle ref="rLifeCycle" num={this.state.num}></LifeCycle>
          </div>
      );
  }
}


export default () => {
    return (
        <Container></Container>
    )
}
