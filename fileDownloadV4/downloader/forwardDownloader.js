/* vim: set expandtab sw=2 ts=2 : */

var http = require('http');
var randomAccessFile = require('random-access-file');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

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
  this.DownloadState = {
    DOWNLOAD_OVER: 0,
    DOWNLOADING: 1,
    CANCELED: 2,
    PAUSED: 3,
    DOWNLOAD_ERR: 4,
    ALREADY_COMPLETE: 5
  };

  this.filename = fileInfo.file_to_save;
  this.filenametmp = this.filename + '.tmp';
  this.filesize = fileInfo.size;
  this.filehash = fileInfo.hash;
  this.downloadsize = 0;
  this.blockindex = 0;
  this.state = null;
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


forwardDownloader.prototype.__proto__ = EventEmitter.prototype;

forwardDownloader.prototype.isInterrupted = function() {
  if(this.state !== this.DownloadState.DOWNLOADING) {
    return true;
  }
  return false;
};
forwardDownloader.prototype.downloadBlock = function() {
  if(this.isInterrupted()) {
    return;
  }

  var params = {
    filehash: this.filehash,
    source: this.source,
    blockindex: this.blockindex,
    blocksize: this.BLOCKSIZE
  };

  var url = this.TURNSERVER + urlencode(params);
  var that = this;
  var request = http.get(url, function(response) {
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

        that.state = that.DownloadState.DOWNLOAD_OVER;
        return that.downloadOverCallback(that);
      })
      .on('error', function(error) {
        console.log('Response error: ' + error);
      });
  })
  .on('error', function(error) {
    console.log('Request error: ' + error);
  })
  .on('socket', function() {
    if(that.isInterrupted()) {
      request.abort();
    }
  });
  request.end();
};

forwardDownloader.prototype.startFileDownload = function() {
  this.state = this.DownloadState.DOWNLOADING;
  this.downloadBlock();
};

forwardDownloader.prototype.pauseFileDownload = function() {
  this.state = this.DownloadState.PAUSED;
};

forwardDownloader.prototype.resumeFileDownload = function() {
  this.state = this.DownloadState.DOWNLOADING;
};

forwardDownloader.prototype.cancelFileDownload = function() {
  this.state = this.DownloadState.CANCELED;
  if(fs.existsSync(this.filename)) {
    fs.unlinkSync(this.filename);
    console.log('Deleted ' + this.filename);
  }
  else if(fs.existsSync(this.filenametmp)) {
    fs.unlinkSync(this.filenametmp);
    console.log('Deleted ' + this.filenametmp);
  }
};

forwardDownloader.prototype.on('pause', function() {
  this.pauseFileDownload();
});

forwardDownloader.prototype.on('resume', function() {
  this.resumeFileDownload();
});

forwardDownloader.prototype.on('cancel', function() {
  this.cancelFileDownload();
});
