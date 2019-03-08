import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SlateEditor from './components/Editor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SlateEditor />
      </div>
    );
  }
}

export default App;
