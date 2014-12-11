/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');

var fileInfo = {
  file_to_save: 'out.mp3',
  hash: 'e46ca1232c7b29102c296d588791e023',
  size: 9593727
};
var my_uid = null;
// TODO I need hosts not uids.
var uploaderUidList = ['http://182.92.212.237:8081', 'http://182.92.212.237:8080'];
var e = null;
var downloadOverCallback = function(that) {
  fs.rename(that.filenametmp, that.filename);

  ENDTIME = new Date().getTime();
  console.log('Used ' + (ENDTIME-STARTTIME/1000.0) + ' seconds');
};
var downloadProgressCallback = function(that) {
  console.log(that.downloadsize / that.filesize);
};

var forwardDownloader = require('./forwardDownloader.js');
forwardDownloader = new forwardDownloader(
  fileInfo, my_uid, uploaderUidList, e, downloadOverCallback, downloadProgressCallback
);

function startFileDownloadTest() {
  console.log('startFileDownloadTest...');
  STARTTIME = new Date().getTime();

  forwardDownloader.startFileDownload();
}

// Main entrance
startFileDownloadTest();
