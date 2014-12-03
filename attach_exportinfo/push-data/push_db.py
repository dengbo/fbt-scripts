#!/usr/bin/env python
import pymongo
import json
from bson.objectid import ObjectId

def rebuild_info(doubaninfo):
    doubaninfo = json.loads(doubaninfo)
    link = '/static/images/res_icon/%s' % doubaninfo['ilink'].split('/')[-1]
    if doubaninfo.has_key('comments'):
        del doubaninfo['comments']
    doubaninfo['link'] = link
    return doubaninfo

if __name__ == '__main__':
    conn = pymongo.Connection('127.0.0.1', 27017)
    fbt = conn['fbt']
    all_resources = fbt['all_resources']
    
    count = 0
    with open('out.final.valid', 'r') as f:
        for line in f:
            if not line:
                break
            array = line.split('\t')
            if len(array) != 3:
                print 'Oh, unexpected error!'

            objectid, filename, doubaninfo = array
            info = rebuild_info(doubaninfo)
            all_resources.update({"_id": ObjectId(objectid)}, {"$set":{"exp_info": info}})

            count += 1

    print "Done %s" % count
