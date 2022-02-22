const events = require("events");
const net = require("net");
const channel = new events.EventEmitter();

channel.clients = {};
channel.subscriptions = {};

/**
 * 一旦加入, 给当前加入的用户创建一个绑定在channel的broadcast事件, 改broadcast事件忽略通知当前用户;
 * 每次都绑定在channel, 所以每次触发'broadcast'都是广播通知
 */
channel.on("join", function(id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (id != senderId) {
      this.clients[id].write(`来自${senderId}: ${message}`); // 忽略对当前用户发通知
    }
  };
  this.on("broadcast", this.subscriptions[id]); // 添加一个专门对当前用户的broadcast事件监听器
});

channel.on('leavel', function(id) {
  channel.removeListener(
    'broadcast', this.subscriptions[id]
  );
  channel.emit('broadcast', id, `${id} has left the chatroom.\n`);
});

// 如果准备关闭聊天室, 先主动发出'shutdown'事件通知所有人
channel.on('shutdown', () => {
  channel.emit('broadcast', '', 'The server has shut down.\n');
  channel.removeAllListeners('broadcast');  // 移除所有绑定的事件
})

const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  channel.emit("join", id, client);

  // 给client绑定消息事件
  client.on("data", data => {
    data = data.toString(); // 收到原data是Buffer类型
    channel.emit("broadcast", id, data);
  });

  client.on('close', () => {
    channel.emmit('leave', id);
  })
});


server.listen(8888);
