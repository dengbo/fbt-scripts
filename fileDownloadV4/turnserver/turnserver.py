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
    def POST(self):
        i = web.input(
            filehash='dsaf123jdfd',
            blockindex=3,
            blocksize=1024,
            source='d232@1.1.1.1:1231|d11@2.2.2.2:1234',
            destination='f123',
        )
        
        rb = RemoteBlock(
            filehash=i.filehash,
            blockindex=i.blockindex,
            blocksize=i.blocksize,
            hosts=[h.split('@')[1] for h in i.source.split('|')]
        )

        return rb.wrappered_data

if __name__ == '__main__':
    app.run()
