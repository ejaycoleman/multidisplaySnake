var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let numberOfDevices = 1

let currentGameplayComputer = 1

io.on('connection', function(socket){
  socket.emit('youAreComputer', numberOfDevices);
  numberOfDevices++
  if (numberOfDevices == 3) {
    numberOfDevices = 1
  }


  


  socket.on('computerHitRightWall', function(data){
  	//console.log('right wall hit' + xaxis)
    currentGameplayComputer = 2

    let lol = {currentGameplayComputer, xaxis: data.yaxis, direction: data.direction}

    io.emit('startGameplay', lol)
  })

  socket.on('computerHitLeftWall', function(data){
    currentGameplayComputer = 1

    let lol = {currentGameplayComputer, xaxis: data.yaxis, direction: data.direction}

    io.emit('startGameplay', lol)
  })

  socket.on('scoreUpdated', function(score) {
    io.emit('newScore', score)
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});