var app = require('http').createServer()
var io = require('socket.io')(app);
var PORT = 8082;

var clientCount = 0;

app.listen(PORT)

io.on('connection', (socket) => {
  clientCount++
  socket.nickname = 'user' + clientCount
  //广播
  io.emit('enter', socket.nickname + ' comes in')

  socket.on('message', function(str) {
    io.emit('message', socket.nickname + ' says: ' + str)
  })

  socket.on('disconnect', () => {
    io.emit('leave',socket.nickname + ' leave')
  })
})
