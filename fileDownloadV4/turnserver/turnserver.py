#!/usr/bin/env python
# encoding: utf-8

import web
from RemoteBlock import *

urls = (
    '/', 'Index',
    '/turn', 'Turn',
)

app = web.application(urls, globals())

class Index:
    def GET(self):
        return 'Hi, I am the turnserver!'

class Turn:
    def GET(self):
        i = web.input(
            filehash=None,
            blockindex=None, 
            blocksize=1024*1024,# 1M
            source=None,#'http://1.1.1.1:1231|http://2.2.2.2:1234',
        )

        if not(i.filehash and i.blockindex and i.blocksize and i.source):
            return ''

        try:
            int(i.blockindex)
            int(i.blocksize)
        except:
            return ''
        
        rb = RemoteBlock(
            filehash=i.filehash,
            blockindex=int(i.blockindex),
            blocksize=int(i.blocksize),
            hosts=[h for h in i.source.split('|')]
        )

        return rb.data

if __name__ == '__main__':
    app.run()
