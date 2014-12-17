#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var io = require('socket.io').listen(8099);


/*
 * SocketPool class
 */
var SocketPool = function(){
  this.pool = {};
};
SocketPool.prototype.add = function(uid, socket) {
  if(uid in this.pool) {
    this.remove(uid);
  }
  this.pool[uid] = socket;
};

SocketPool.prototype.remove = function(uid) {
  if(uid in this.pool) {
    console.log('Force disconnecting previous socket. uid:' + uid + ' socket:' + this.pool[uid].id);
    this.pool[uid].disconnect();
    delete this.pool[uid];
  }
};

SocketPool.prototype.removeBySocket = function(socket) {
  console.log('Remove socket:' + socket.id);
  for(var uid in this.pool) {
    if(this.pool[uid].id === socket.id) {
      this.remove(uid);
      return;
    }
  }
};

SocketPool.prototype.get = function(uid) {
  if(uid in this.pool) {
    return this.pool[uid];
  }
  return null
}

SocketPool.prototype.has = function(uid) {
  if(uid in this.pool) {
    return true;
  }
  return false;
}


/*
 * SocketPool instance
 */
var socketPool = new SocketPool();

io.sockets.on('connection', function (socket) {
  socket.on('LOGIN', function (uid) {
    socketPool.add(uid, socket);
    console.log(socket.id);
    console.log(uid + ' logined');
  });

  socket.on('SEND', function (msg) {
    var dSocket = socketPool.get(msg.dUid);
    if(dSocket) {
      dSocket.emit('RECV' + msg.dUid, msg);

      console.log(JSON.stringify(msg) + ' sent');
    }
    else {
      var err = JSON.stringify(msg) + ' not sent';
      console.log(err);
      socket.emit('ERROR' + msg.sUid, err);
    }
  });

  socket.on('disconnect', function() {
    socketPool.removeBySocket(socket);
  });
});
