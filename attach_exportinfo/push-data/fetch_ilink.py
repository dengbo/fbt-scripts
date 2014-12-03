#!/usr/bin/env python
import json

def rebuild_info(doubaninfo):
    doubaninfo = json.loads(doubaninfo)
    link = '/static/images/res_icon/%s' % doubaninfo['ilink'].split('/')[-1]
    if doubaninfo.has_key('comments'):
        del doubaninfo['comments']
    doubaninfo['link'] = link
    return doubaninfo

if __name__ == '__main__':
    ilinks = []
    with open('out.final.valid', 'r') as f:
        for line in f:
            if not line:
                break
            array = line.split('\t')
            if len(array) != 3:
                print 'Oh, unexpected error!'
            
            objectid, filename, doubaninfo = array
            doubaninfo = json.loads(doubaninfo)
            ilink = doubaninfo['ilink']
            ilinks.append(ilink)

    with open('ilinks.forwget', 'w') as f:
        f.write('\n'.join(ilinks))

    print 'Done!'
