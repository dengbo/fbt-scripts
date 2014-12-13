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
  if(fs.existsSync(that.filenametmp)) {
    fs.rename(that.filenametmp, that.filename);
  }

  ENDTIME = new Date().getTime();
  console.log('Used ' + (ENDTIME-STARTTIME)/1000 + ' seconds');
};
var downloadProgressCallback = function(that) {
  console.log(that.downloadsize / that.filesize);
};

var forwardDownloader = require('./forwardDownloader.js');
forwardDownloader = new forwardDownloader(
  fileInfo, my_uid, uploaderUidList, e, downloadOverCallback, downloadProgressCallback
);

/*
 * Tests
 */
function startFileDownloadTest() {
  console.log('startFileDownloadTest...');
  forwardDownloader.startFileDownload();
}

function pauseFileDownloadTest() {
  function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }

  forwardDownloader.startFileDownload();
  sleep(5000);
  console.log('Pausing...');
  forwardDownloader.emit('pause');
}

function resumeFileDownloadTest() {
  function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }

  forwardDownloader.startFileDownload();
  sleep(5000);
  console.log('Pausing...');
  forwardDownloader.emit('pause');
  sleep(10);
  console.log('Resuming...');
  forwardDownloader.emit('resume');
  sleep(10000);
  console.log('Pausing...');
  forwardDownloader.emit('pause');
  sleep(2000);
  console.log('Resuming...');
  forwardDownloader.emit('resume');
}

function cancelFileDownloadTest() {
  forwardDownloader.cancelFileDownload();
}

/*
 * Main entrance
 */
STARTTIME = new Date().getTime();
//startFileDownloadTest();
//pauseFileDownloadTest();
resumeFileDownloadTest();
//cancelFileDownloadTest();
