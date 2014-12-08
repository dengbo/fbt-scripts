#!/usr/bin/env python
# encoding: utf-8

import web
import mmap
import contextlib

urls = (
    '/', 'Index',
)

app = web.application(urls, globals())

db = {'e46ca1232c7b29102c296d588791e023': 'qinghuaci.mp3'}

class Index:
    def GET(self):
        i = web.input(filehash=None, blockindex=None, blocksize=None)
        if not (i.filehash and i.blockindex and i.blocksize):
            return {'error': 'Invalid get arguments'}

        filehash = i.filehash
        if filehash not in db:
            return {'error': 'Cannot find hash: %s' % filehash}

        blockindex = int(i.blockindex)
        blocksize = int(i.blocksize)
        with open(db[filehash], 'rb') as f:
            with contextlib.closing(
                mmap.mmap(f.fileno(),
                0,
                access=mmap.ACCESS_READ)) as m:
                blocknum = len(m) / blocksize
                if blockindex <= blocknum:
                    print blockindex*blocksize, (blockindex+1)*blocksize
                    return m[blockindex*blocksize:(blockindex+1)*blocksize]
                elif blockindex == blocknum + 1 and len(m) % blocksize:
                    print blockindex*blocksize, 'end'
                    return m[blockindex*blocksize:]
                else:
                    return ''

if __name__ == '__main__':
    app.run()
