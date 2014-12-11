/* vim: set expandtab sw=2 ts=2 : */

var http = require('http');
var randomAccessFile = require('random-access-file');
var fs = require('fs');

function urlencode(params) {
  var result = [];
  for(var key in params) {
    result.push([key, params[key]].join('='));
  }
  return result.join('&');
}

var forwardDownloader = module.exports = function(
  fileInfo,
  my_uid,
  uploaderUidList,
  e, 
  downloadOverCallback,
  downloadProgressCallback
) {
  this.BLOCKSIZE = 1024*1024; // 1MB
  this.TURNSERVER = 'http://127.0.0.1:8080/turn?';

  this.filename = fileInfo.file_to_save;
  this.filenametmp = this.filename + '.tmp';
  this.filesize = fileInfo.size;
  this.filehash = fileInfo.hash;
  this.downloadsize = 0;
  this.blockindex = 0;
  // No need of UidList. I need hosts!
  this.source = uploaderUidList.join('|'); //http://1.1.1.1:1111|http://2.2.2.2:2222
  this.downloadOverCallback = downloadOverCallback;
  this.downloadProgressCallback = downloadProgressCallback;

  (function recovery(that) {
    if(fs.existsSync(that.filename)) {
      var size = fs.statSync(that.filename).size;
      if(size == that.filesize) {
        that.blockindex = Math.ceil(size / that.BLOCKSIZE);
        that.downloadsize = size;
      }
    }
    else if(fs.existsSync(that.filenametmp)) {
      var size = fs.statSync(that.filenametmp).size;
      if(size === that.filesize) {
        fs.rename(that.filenametmp, that.filename);
      }
      else {
        that.blockindex = Math.floor(size / that.BLOCKSIZE);
        that.downloadsize = that.blockindex * that.BLOCKSIZE;
      }
    }
    
  }(this));
};

forwardDownloader.prototype.downloadBlock = function() {
  var params = {
    filehash: this.filehash,
    source: this.source,
    blockindex: this.blockindex,
    blocksize: this.BLOCKSIZE
  };

  var url = this.TURNSERVER + urlencode(params);
  var that = this;
  http.get(url, function(response) {
      response.setEncoding('binary'); 

      var block = [];
      response.on('data', function(chunk){
        chunk = new Buffer(chunk, 'binary');
        block.push(chunk);
        that.downloadsize += chunk.length;
        that.downloadProgressCallback(that);
      })
      .on('end', function() {
        if(block.length) {
          randomAccessFile(that.filenametmp).write(that.blockindex*that.BLOCKSIZE, Buffer.concat(block));
          that.blockindex++;
          return that.downloadBlock();
        }

        return that.downloadOverCallback(that);
      })
      .on('error', function() {
        // TODO
      });
  });
};

// Exports functions
forwardDownloader.prototype.startFileDownload = function() {
  this.downloadBlock();
};

// TODO
//forwardDownloader.prototype.pauseFileDownload = function() {};
//forwardDownloader.prototype.resumeFileDownload = function() {};
//forwardDownloader.prototype.cancelFileDownload = function() {};

