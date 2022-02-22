import React from 'react'

function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} defaultValue='100' />
    </div>
  );
}

function Parent(props) {
  return (
    <div>
      My input: <CustomTextInput inputRef={props.inputRef} />
    </div>
  );
}


class Grandparent extends React.Component {
  componentDidMount(){
    console.log('Grandparent\'s value: ' +  this.input.defaultValue)
    console.log('Grandparent get grandchild\'s value => '  + this.inputElement.defaultValue)
  }
  render() {
    return (
      <div>
        <input type="text" defaultValue="200" ref={(c) => this.input = c} />
        <Parent
          inputRef={el => this.inputElement = el}
        />
      </div>
    );
  }
}

export default Grandparent