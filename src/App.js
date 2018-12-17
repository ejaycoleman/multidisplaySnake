import React, { Component } from 'react';
import './App.css';


import openSocket from 'socket.io-client';


const GridCell = props => {

  return (
    <div
      style={{ height: props.size + "px", width: props.size + "px", backgroundColor: props.snake ? "#4ECDC4" : props.food ? "#FF6B6B" : "#F7FFF7" }}
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
      dx: 0,
      changingDirection: false,
      computer: 0,
      currentGameplayComputer: 0,
      score: 0
    };

    this.moveSnake = this.moveSnake.bind(this)
    this.moveFood = this.moveFood.bind(this);
    this.setDirection = this.setDirection.bind(this)
    this.removeTimers = this.removeTimers.bind(this)
  }

  moveFood() {
    const x = parseInt(Math.random() * this.numCells);
    const y = parseInt(Math.random() * this.numCells);
    this.setState({ food: [x, y] });
  }

  moveSnake() {
    this.setState({changingDirection: false})


    let snake = this.state.snake
    const head = {x: this.state.snake[0].x + this.state.dx, y: this.state.snake[0].y + this.state.dy};

    snake.unshift(head);

    if(this.checkIfAteFood()) {
      this.setState({score: this.state.score + 10})
      this.socket.emit('updateScore', this.state.score)

      this.moveFood()
    } else {
      snake.pop();
    }

    this.setState({snake})
    !this.isValid(head, snake) && this.endGame()
  }

  checkIfAteFood() {
    return (this.state.snake[0].x === this.state.food[0] && this.state.snake[0].y === this.state.food[1])
  }

  isValid(head, snake) {
    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return false
      }
    }

    if (head.x === -1) {
      let data = {yaxis: this.state.snake[0].y, snakeLength: this.state.snake.length }

      this.socket.emit('computerHitLeftWall', data)
      if (this.state.computer === 1) return false
    }

    if (head.x === this.numCells) {
      let data = {yaxis: this.state.snake[0].y, snakeLength: this.state.snake.length }
      this.socket.emit('computerHitRightWall', data)
      
      if (this.state.computer === 2) return false
    }

    if (head.y === -1 || head.y === this.numCells) {
      return false
    } 

    return true
  }

  endGame() {
    alert("Well done! You got " + this.state.score + " points!")
    this.startGame()
  }

  startGame() {
    this.removeTimers()

    this.setState({
      snake: [{x: 5, y: 5}],
      dy: 1,
      dx: 0,
      food: [10, 10]
    }, () => { this.moveFood() })

    this.moveSnakeInterval = setInterval(this.moveSnake, 400)

    this.el.focus()
  }

  resumeGame(yaxis, length) {
    this.removeTimers()

    let newSnake = [{x: this.state.computer === 1? this.numCells -1 : 0, y: yaxis}]

    for (let i = 1; i < length; i++) {
      newSnake.push({x: this.state.computer === 1? (this.numCells -1 + i) : (0 - i), y: yaxis})
    }

    this.setState({
      snake: newSnake,
      dy: 0,
      dx: this.state.computer === 1? -1  : 1,
      food: [10, 10]
    })
    this.moveSnakeInterval = setInterval(this.moveSnake, 400)
    this.el.focus()
  }

  pauseGame() {
    if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
  }

  removeTimers() {
    if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout)
  }

   componentDidMount() {
    this.removeTimers();

    this.socket = openSocket('http://192.168.0.12:8000');

    this.socket.on('youAreComputer', computer => {
      this.setState({computer})
      console.log("this is computer: " + computer)
    });

    this.socket.on('updateNewScore', score => {
      this.setState({score: score})
    })

    this.socket.on('startGameplay', (data) => {
      this.setState({currentGameplayComputer: data.currentGameplayComputer})
      if (this.state.currentGameplayComputer === this.state.computer) {
        this.resumeGame(data.yaxis, data.length)
      } 
    })

    this.startGame()
   }

  setDirection({ keyCode }) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (this.state.changingDirection) return
    
    this.setState({changingDirection: true})


    const keyPressed = keyCode;
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
    this.numCells = Math.floor(350 / 15);
    const cellSize = 350 / this.numCells;
    const cellIndexes = Array.from(Array(this.numCells).keys());
    const cells = cellIndexes.map(y => {
      return cellIndexes.map(x => {
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
        <div>
          <h1>Your score: {this.state.score}</h1>
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