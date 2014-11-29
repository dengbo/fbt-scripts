#!/usr/bin/env bash

function write_test()
{
    local block="$1"
    local cnt="$2"
    lines="//set by experiment
    var BLOCK_INCREASED = 1;
    var config = { BLOCK_SIZE: $block * $block * BLOCK_INCREASED, //1M
    MAX_HTTP_CONNECTION_CNT: $cnt , //100? //30=~2.5MB
    STATE_FILE: path.join(global.fbt, 'downloadState.json'),
    OWNER_FILE: path.join(global.fbt, 'downloadOwner.json')
    };//set to current path"
    echo "$lines" >> fileDownloadV6/downloadFile.js

}

test1=(120 150 200)
for cnt in "${test1[@]}"
do
    echo "start!" 
    echo "delete download"
    rm -r downloads
    echo "count $cnt"
    cat down_part1.js > fileDownloadV6/downloadFile.js 
    write_test "832" "$cnt"
    cat down_part2.js >> fileDownloadV6/downloadFile.js 
    
    now=`date "+%Y-%m-%d %H:%M:%S"`
    echo "$now"
    start=`date +%s -d "$now"`
    node test.js
    now=`date "+%Y-%m-%d %H:%M:%S"`
    echo "$now"
    end=`date +%s -d "$now"`

    echo $(($end-$start)) 
    touch "$cnt.$(($end-$start))"

    echo -e "====\n"
done
