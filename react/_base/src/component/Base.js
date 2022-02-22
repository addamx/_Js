import React from 'react';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';

//CSSTransitionGroup
class CssTransitions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        'a', 'b', 'c', 'd'
      ]
    };
    this.addItem = this.addItem.bind(this)
  }

  addItem() {
    this.setState((prevState) => { return {list: [...prevState.list, 'newItem']} })
  }

  render() {
    const defaultStyle = {
      transition: `opacity 300ms ease-in-out`,
      opacity: 0,
    }
    const transitionStyles = {
      entering: { opacity: 0 },
      entered: { opacity: 1 },
    };
    return (
      <div>
        <button onClick={this.addItem}>add</button>
        <Transition in={true} timeout={3003}>
          {(state) => (
            <ul style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
            {
              this.state.list.map((el, index) => (
                <li key={index}>
                  {el}
                </li>
              ))
            }
            </ul>
          )}
        </Transition>
      </div>
    )
  }
}

//受控组件 (类似vue的v-modol)
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '相当于Vue的v-model',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div>
        <label>
          <textarea value={this.state.value} onChange={this.handleChange} cols="20" rows="10" />
        </label>
        <div>{this.state.value}</div>
      </div>
    );
  }
}


/***
* 包含关系 (类似vue 的slot)
{props.children} 则渲染所有props Dom
*/
function Contacts() {
  return (
    <div>Contacts Component</div>
  )
}
function Chat() {
  return (
    <div>Chat Component</div>
  )
}
function Wrapper(props) {
  return (
    <i>{props.children}</i>
  )
}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        <Wrapper>{props.left}</Wrapper>
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function IncludeApp() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}



/**
 * findDOMNode: 提取真正的DOM
 */
class DomNode extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.refs.myTextInput.focus();
  }
  render() {
    return (
      <div>
        <input type="text" ref="myTextInput" />
        <input type="button" value="Focus the text input" onClick={this.handleClick} />
      </div>
    );
  }
}




export default () => {
  return (
    <section>
    <h3>Base Test</h3>
    <h5>input-model 双向绑定</h5>
    <NameForm />
    <hr/>
    <h5>组件之间的包含关系</h5>
    <IncludeApp />
    <hr/>
    <DomNode />
    <hr/>
    <CssTransitions />
  </section>
  )
}
