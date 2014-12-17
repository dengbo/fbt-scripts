#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var io = require('socket.io-client');


var uid = process.argv[2];
if(!uid) {
  var usage = 'Usage:\n' +
    '  node receiver.js [MY_UID]\n';
  console.log(usage);
  process.exit(1);
}


var serverAddress = 'http://127.0.0.1:8099';
var socket = io.connect(serverAddress);


socket.emit('LOGIN', uid);
socket.on('RECV' + uid, function(msg) {
  console.log(msg);

  var replyMsg = {
    sUid: uid,
    dUid: msg.sUid,
    content: 'Hello, I am receiver'
  }
  socket.emit('SEND', replyMsg);
});

socket.on('ERROR' + uid, function(err) {
  console.log(err);
});
