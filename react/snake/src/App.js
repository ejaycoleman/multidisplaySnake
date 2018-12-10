import React, { Component } from 'react';
import './App.css';

const GridCell = props => {

  return (
    <div
      style={{ height: props.size + "px", width: props.size + "px", backgroundColor: props.snake ? "blue" : props.food ? "red" : "white" }}
      />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snake: [],
      food: [],
      dy: 1,
      dx: 0
    };

    this.moveSnake = this.moveSnake.bind(this)
    this.moveFood = this.moveFood.bind(this);
    this.setDirection = this.setDirection.bind(this)
    this.removeTimers = this.removeTimers.bind(this)
  }

  moveFood() {
    // if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout)
    const x = parseInt(Math.random() * this.numCells);
    const y = parseInt(Math.random() * this.numCells);
    this.setState({ food: [x, y] });
    // this.moveFoodTimeout = setTimeout(this.moveFood, 5000)


  }

  moveSnake() {
    let snake = this.state.snake
    const head = {x: this.state.snake[0].x + this.state.dx, y: this.state.snake[0].y + this.state.dy};

    snake.unshift(head);
    

    

    if(this.checkIfAteFood()) {
      this.moveFood()
    } else {
      snake.pop();
    }

    this.setState({snake})
  }

  checkIfAteFood() {
    // if  {
    //   this.moveFood()
    // }

    return (this.state.snake[0].x === this.state.food[0] && this.state.snake[0].y === this.state.food[1])
  }



  startGame() {
    //this.removeTimers();
    //this.moveSnakeInterval = setInterval(this.moveSnake, 130);
    //this.moveFood();

    this.setState({
      snake: [{x: 5, y: 5}],
      food: [10, 10]
    }, () => { this.moveFood() });

   

    this.moveSnakeInterval = setInterval(this.moveSnake, 130);
    //need to focus so keydown listener will work!
    //this.el.focus();
    this.el.focus();
  }

  removeTimers() {
    if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout)
  }

   componentDidMount() {
    this.removeTimers();
    this.startGame()
   }

  setDirection({ keyCode }) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    /**
     * Prevent the snake from reversing
     * Example scenario:
     * Snake is moving to the right. User presses down and immediately left
     * and the snake immediately changes direction without taking a step down first
     */
    // if (changingDirection) return;
    // changingDirection = true;
      const keyPressed = keyCode;
      //const goingUp = dy === -10;
      const goingUp = this.state.dy === -1;
     const goingDown = this.state.dy === 1;
      const goingRight = this.state.dx === 1;
      const goingLeft = this.state.dx === -1;
      if (keyPressed === LEFT_KEY && !goingRight) {
        this.setState({dx: -1, dy: 0})
      }
      if (keyPressed === UP_KEY && !goingDown) {
        this.setState({dx: 0, dy: -1})
      }
      if (keyPressed === RIGHT_KEY && !goingLeft) {
        this.setState({dx: 1, dy: 0})
      }
      if (keyPressed === DOWN_KEY && !goingUp) {
        this.setState({dx: 0, dy: 1})
      }
  }

  componentWillUnmount() {
    this.removeTimers();
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
      <div className="App" >
        <header className="App-header" >
        <div  >
          <div style={{
            boxSizing: "content-box",
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            width: '350px'}}


            ref={el => (this.el = el)} onKeyDown={this.setDirection} tabIndex={-1}
          >
            {cells}
          </div>
        </div>
        </header>
      </div>
    );
  }
}

export default App;




