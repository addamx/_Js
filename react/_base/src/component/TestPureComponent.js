import React from 'react'


export default class TestPureComponent extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      list: ['a', 'b', 'c'],
      obj: {name: 'Tom', age: 16}
    }
    this.changeArr01 = this.changeArr01.bind(this)
    this.changeArr02 = this.changeArr02.bind(this)
    this.changeArr03 = this.changeArr03.bind(this)
    this.changeObj01 = this.changeObj01.bind(this)
    this.changeObj02 = this.changeObj02.bind(this)
  }
  changeArr01() {
    this.setState({
      list: this.state.list.concat(['d'])
    })
  }

  changeArr02() {
    this.setState({
      list: [...this.state.list, 'd']
    })
  }

  changeArr03() {
    let List = this.state.list
    List.push('d')
    this.setState({
      list: List
    })
  }

  changeObj01() {
    this.setState({
      obj: Object.assign({}, this.state.obj, { name: 'Jack' })
    })
  }
  changeObj02() {
    this.setState({
      obj: Object.assign(this.state.obj, { name: 'Mary' })
    })
  }

  render() {
    return (
      <div>
        <h2>This is a Pure PureComponent</h2>
        <h5>List</h5>
        <ul>
          {
            this.state.list.map( (el, index) => (
              <li key={index}>{el}</li>
            ) )
          }
        </ul>
        <pre>{`this.state.list.concat(['d'])`}</pre>
        <button onClick={this.changeArr01}>Render</button>
        <pre>{`[...this.state.list, 'd'])`}</pre>
        <button onClick={this.changeArr02}>Render</button>
        <pre>{`let List = this.state.list; List.push('d'))`}</pre>
        <button onClick={this.changeArr03}>No Render</button>


        <h5>Object</h5>
        <p>{this.state.obj.name}</p>
        <pre>{`Object.assign({}, this.state.obj, {name: 'Jack' })`}</pre>
        <button onClick={this.changeObj01}>Render</button>
        <pre>{`Object.assign(this.state.obj, {name: 'Mary' })`}</pre>
        <button onClick={this.changeObj02}>No Render</button>
      </div>
    )
  }
}
