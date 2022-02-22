const net = require('net');
const server = net.createServer(socket => {
  socket.on('data', data => {
    console.log('From Client:', data)
    socket.write('From Server: TMD');
  });
  socket.once('data', data => {
    // ...
  })
})

server.listen(8888, '127.0.0.1');
