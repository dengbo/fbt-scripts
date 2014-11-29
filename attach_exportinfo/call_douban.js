global.exec_path = '/home/zhangyang/workspace/fbt/fbt_node_client/node_modules';
var douban = require('./douban.js');
var fs = require('fs');

/*
process.on('uncaughtException', function(err) {
});

douban.getInfo('南京', function(info) {
    console.log(info)
});
*/
var lines = fs.readFileSync('filenames.csv.2').toString().split('\n');
var index = 0;
setInterval(function(){
    var line = lines[index];
    var array = line.split('\t');
    var id = array[0];
    var filename = array[1];
    douban.getInfo(filename, function(info) {
        if(info) {
            //line = line + "\t" + JSON.stringify(info);
            fs.appendFileSync('out.txt', line + "\t" + JSON.stringify(info) + '\n');
        }
        else
        {
            //line = line + "\t";
            fs.appendFileSync('out.txt', line + "\t" + '\n');
        }
        index++;
    });
}, 15000);
