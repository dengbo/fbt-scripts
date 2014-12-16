#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var io = require('socket.io').listen(8099);

var socketPool = {};

io.sockets.on('connection', function (socket) {
  socket.on('LOGIN', function (uid) {
    socketPool[uid] = socket;
    console.log('Push uid: ' + uid);
  });

  socket.on('SEND', function (msg) {
    console.log(msg.src + 
      ' wanna send ' + 
      msg.content + 
      ' to ' + msg.dst
    );

    socketPool[msg.dst].emit(msg.dst, msg);
    socket.emit('456', 'test 456');
  });
});
