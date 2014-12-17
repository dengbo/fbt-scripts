#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var io = require('socket.io-client');

var uid = process.argv[2];
var uploaderUid = process.argv[3];
if(!uid || !uploaderUid) {
  var usage = 'Usage:\n' +
    '  node sender.js [MY_UID] [RECEIVER_UID]\n';
  console.log(usage);
  process.exit(1);
}

var serverAddress = 'http://127.0.0.1:8099';
var socket = io.connect(serverAddress);

socket.emit('LOGIN', uid);
socket.emit('SEND', {
  sUid: uid,
  dUid: uploaderUid,
  content: 'Hi, I am sender'
});

socket.on('RECV' + uid, function(msg) {
  console.log(msg);
});

socket.on('ERROR' + uid, function(err) {
  console.log(err);
});
