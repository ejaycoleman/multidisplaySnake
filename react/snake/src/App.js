import React, { Component } from 'react';
import './App.css';

const GridCell = props => {

  return (
    <div
      style={{ height: props.size + "px", width: props.size + "px", backgroundColor: props.food ? "red" : props.snake ? "blue" : "white" }}
      />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snake: [],
      food: [],
    };

    this.moveSnake = this.moveSnake.bind(this);
  }

  moveSnake() {
      // Create the new Snake's head

      let snake = this.state.snake
      const head = {x: this.state.snake[0].x + 1, y: this.state.snake[0].y + 0};
      // Add the new head to the beginning of snake body
      snake.unshift(head);
      // const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
      // if (didEatFood) {
      //   // Increase score
      //   score += 1;

      //   socket.emit('scoreUpdated', score)
      //   // Display score on screen
      //   document.getElementById('score').innerHTML = score;
      //   // Generate new food location
      //   createFood();
      // } else {
      //   // Remove the last part of snake body
        snake.pop();

      this.setState({snake})
      // }
    }



  startGame() {
    //this.removeTimers();
    //this.moveSnakeInterval = setInterval(this.moveSnake, 130);
    //this.moveFood();

    this.setState({
      snake: [{x: 5, y: 5}],
      food: [10, 10]
    });

    this.moveSnakeInterval = setInterval(this.moveSnake, 130);
    //need to focus so keydown listener will work!
    //this.el.focus();
  }

   componentDidMount() {
    this.startGame()
   }



  render() {

    // this.startGame()


    this.numCells = Math.floor(350 / 15);
    //const cellSize = this.props.size / this.numCells;
    const cellSize = 350 / this.numCells;
    const cellIndexes = Array.from(Array(this.numCells).keys());
    const cells = cellIndexes.map(y => {
      return cellIndexes.map(x => {
        //  const isFood = this.state.food[0] === x && this.state.food[1] === y;
        //let snakeCell = this.state.snake.filter(c => c[0] === x && c[1] === y);

        let isCellSnake = this.state.snake.filter(i => i.x === x && i.y === y).length === 1 ? true : false
        const isCellFood = this.state.food[0] === x  && this.state.food[1] === y



        return (

          <GridCell key={x} size={cellSize} snake={isCellSnake} food={isCellFood} />
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




