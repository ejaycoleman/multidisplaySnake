// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

// let numberOfDevices = 1

// let currentGameplayComputer = 1

// io.on('connection', function(socket){
//   socket.emit('youAreComputer', numberOfDevices);
//   numberOfDevices++
//   if (numberOfDevices === 3) {
//     numberOfDevices = 1
//   }

//   socket.on('computerHitRightWall', function(data){
//     currentGameplayComputer = 2

//     let lol = {currentGameplayComputer, xaxis: data.yaxis, direction: data.direction}

//     io.emit('startGameplay', lol)
//   })

//   socket.on('computerHitLeftWall', function(data){
//     currentGameplayComputer = 1

//     let lol = {currentGameplayComputer, xaxis: data.yaxis, direction: data.direction}

//     io.emit('startGameplay', lol)
//   })

//   socket.on('scoreUpdated', function(score) {
//     io.emit('newScore', score)
//   })
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });






var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let numberOfDevices = 1
let currentGameplayComputer = 1

io.on('connection', function(socket){

  console.log("user connected ")
  socket.emit('youAreComputer', numberOfDevices);
  numberOfDevices++
  if (numberOfDevices === 3) {
    numberOfDevices = 1
  }

  socket.on('computerHitLeftWall', function(data){
    console.log("LeftWallHit!")
    currentGameplayComputer = 1

    let yaxis = data.yaxis
    let length = data.snakeLength

    let newData = {currentGameplayComputer, yaxis, length}
    io.emit('startGameplay', newData)
  })

  socket.on('computerHitRightWall', function(data){
    console.log("RightWallHit!")
    currentGameplayComputer = 2

    let yaxis = data.yaxis
    let length = data.snakeLength

    let newData = {currentGameplayComputer, yaxis, length}
    io.emit('startGameplay', newData)
  })

  socket.on('updateScore', function(score) {
    console.log('new')
    io.emit('updateNewScore', score)
  })
  
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});