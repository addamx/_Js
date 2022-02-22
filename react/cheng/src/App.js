import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Hello from './components/Hello';

class App extends Component {
  render() {
    return <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>Test babel</p>
        <p>Test babel</p>
        <p className="App-intro">
          <Hello />
          <p>Test babel</p>
        </p>
      </div>;
  }
}

export default App;
