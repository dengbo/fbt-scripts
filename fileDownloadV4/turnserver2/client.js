#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var io = require('socket.io-client');

var uid = process.argv[2];
var serverAddress = 'http://127.0.0.1:8099';

var socket = io.connect(serverAddress);
socket.emit('LOGIN', uid);

if(uid === '123') {
  socket.emit('SEND', {
    src: uid,
    dst: '456',
    content: 'IAM123'
  });
}

console.log(uid);
socket.on(uid, function (msg) {
  console.log(
    'recv msg from ' + msg.src
  );
  console.log(msg);
});
