#!/usr/bin/env python
# encoding: utf-8

import urllib2
import urllib
import socket

class RemoteBlockException(Exception):
    pass

class RemoteBlock(object):
    def __init__(self, **kwargs):
        for key in kwargs:
            setattr(self, key, kwargs[key])
        if not (
            hasattr(self, 'filehash')
            and hasattr(self, 'blockindex')
            and hasattr(self, 'blocksize')
            and hasattr(self, 'hosts')
        ):
            raise RemoteBlockException('Need filehash, blockindex, blocksize')

        host = self._choose_host()
        data = self._pull_data(host) if host else ''
        self.data = data

    def _pull_data(self, host):
        data = ''
        params = urllib.urlencode({
            'blockindex': self.blockindex,
            'blocksize': self.blocksize,
            'filehash': self.filehash
        })
        url = '%s?%s' % (host, params)
        
        response = urllib2.urlopen(url, timeout=5)
        data = response.read()
        return data

    def _choose_host(self):
        for host in self.hosts:
            if self._valid_host(host):
                return host
        return None

    def _valid_host(self, host):
        _host, _port = host.replace('http://', '').split(':')
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        if sock.connect_ex((_host, int(_port))) == 0:
            return True
        else:
            return False

if __name__ == '__main__':
    index = 0
    f = open('test.mp3', 'wb')
    while True:
        print index
        rb = RemoteBlock(
            filehash='e46ca1232c7b29102c296d588791e023',
            blockindex=index,
            blocksize=1024*1024, # 1MB
            hosts=['http://127.0.0.1:8910', 'http://127.0.0.1:8911']
        )
        if rb.data:
            f.write(rb.data)
            index += 1
        else:
            break
    f.close()
