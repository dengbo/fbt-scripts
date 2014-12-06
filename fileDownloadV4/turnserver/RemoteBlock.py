#!/usr/bin/env python
# encoding: utf-8

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
            raise RemoteBlockException('Need filehash, blockindex , blocksize')

        host = self._choose_host()
        data = self._pull_data(host) if host else -1
        if data != -1:
            self.status = True
            self.data = data
            self.wrappered_data = self._wrapper(data)
        else:
            self.status = False
            self.data = ''
            self.wrappered_data = ''

    def _choose_host(self):
        for host in self.hosts:
            if self._valid_host(host):
                return host
        return None

    def _wrapper(self, data):
        pass

    def _valid_host(self, host):
        pass

if __name__ == '__main__':
    rb = RemoteBlock(
        filehash='123',
        blockindex=1,
        blocksize=1024,
        hosts=['1.1.1.1:111', '2.2.2.2:22']
    )

    with open('test.mp3', 'wb') as f:
        f.write(rb.data)
