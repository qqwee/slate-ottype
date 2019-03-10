import React, { Component } from 'react';
import './App.css';
// import SlateEditor from './components/Editor';
import EditorHTML from './components/Editor.html';

class App extends Component {
  render() {
    return (
      <div className="App">
        <EditorHTML />
        {/* <SlateEditor /> */}
      </div>
    );
  }
}

export default App;
