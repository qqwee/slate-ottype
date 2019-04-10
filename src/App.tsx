import React, { Component } from 'react';
import './App.css';
// import SlateEditor from './components/Editor';
import EditorHTML from './components/Editor.html';
import OperationViewer from './components/OperationViewer';
class Stack { 
  private items: any[];
  static MAX_LEN = 10;
  constructor(init: any[] = []) { 
    this.items = init || []; 
  }
  public pop = () => {
    const el = this.items;
    this.items = [];
    return el;
  };
  public push = (el) => {
    this.pop();
    this.items = [...el];
  };
  /*
  public pop = () => {
    const el = this.items[0];
    this.items = this.items.slice(1);
    return el;
  };
  */
 /*
  public push = (el) => {
    console.log('CALLED PUSH');
    while (this.items.length >= Stack.MAX_LEN) {
      this.items = this.items.slice(1);
    }
    this.items = [...this.items, el];
  };*/
  public view = (dummy: (any) => any) => {

    const res = this.items.map(i => {
      return dummy(i.toJSON());
    });
    return res;
  };
} 

class App extends Component {
  state = {
    flag: 1,
  }
  private opsStack = new Stack();
  private opsChanger = (ops) => {
    console.log(ops);
    this.opsStack.push(ops);
    this.state.flag ? this.setState({ flag: 0}) : this.setState({flag: 1});
  };
  render() {
    return (
      <div className="App">
        <EditorHTML opsChanger={this.opsChanger}/>
        {/* <SlateEditor opsChanger={this.opsChanger}/> */}
        <OperationViewer ops={this.opsStack} />
      </div>
    );
  }
}

export default App;
