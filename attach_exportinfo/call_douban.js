var douban = require('./douban.js');
var fs = require('fs');

var doneTask = fs.existsSync('out.txt') ? fs.readFileSync('out.txt').toString().split('\n') : [];
var doneTaskIDs = [];
doneTask.forEach(function(task) {
    var id = task.split('\t')[0];
    doneTaskIDs.push(id);
});
var allTask = fs.readFileSync('filenames.csv.2').toString().split('\n');
var diffTask = [];
allTask.forEach(function(task) {
    var id = task.split('\t')[0];
    if(doneTaskIDs.indexOf(id) < 0) {
        diffTask.push(task);
    }
});

var index = 0;
setInterval(function(){
    var task = diffTask[index];
    var array = task.split('\t');
    var id = array[0];
    var filename = array[1];

    douban.getInfo(filename, function(info) {
        if(info) {
            //task = task + "\t" + JSON.stringify(info);
            fs.appendFileSync('out.txt', task + "\t" + JSON.stringify(info) + '\n');
        }
        else
        {
            //task = task + "\t";
            fs.appendFileSync('out.txt', task + "\t" + '\n');
        }
        index++;
    });
}, 15000);
