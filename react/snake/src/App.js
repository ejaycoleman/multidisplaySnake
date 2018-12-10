import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const GridCell = props => {

  return (
    <div
      style={{ height: props.size + "px", width: props.size + "px", backgroundColor: "white" }}
      />
  );
}

class App extends Component {



  render() {
    this.numCells = Math.floor(350 / 15);
    //const cellSize = this.props.size / this.numCells;
    const cellSize = 350 / this.numCells;
    const cellIndexes = Array.from(Array(this.numCells).keys());
    const cells = cellIndexes.map(y => {
      return cellIndexes.map(x => {
        return (

          <GridCell key={x} size={cellSize}/>
        );
      });
    });



    return (
      <div className="App">
        <header className="App-header">
         
          <div style={{
            boxSizing: "content-box",
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            width: '350px'}}
          >
            {cells}
          </div>
          
        </header>
      </div>
    );
  }
}

export default App;




