# Introduction

Simple BitTorrent client implemented in Node.js for educational purposes.

# Features

* Encode / Decode basic [bencode](https://en.wikipedia.org/wiki/Bencode) serializated fields: strings, integers, arrays and dictionaries.
* Basic unit tests for encoding / decoding
* Parse simple [metainfo files](https://www.bittorrent.org/beps/bep_0003.html#metainfo-files) (.torrent)
* Calculation of [info hash](https://www.bittorrent.org/beps/bep_0003.html#info-dictionary) (unique identifier for a torrent file)

# Usage

```
npm run dev decode bencode
```

```
npm run dev info .torrent_file
```

```
npm run dev peers .torrent_file
```

# Tests

Some basic unit tests have been created with [Jest](https://jestjs.io/)

```
npm test
```


# To Do

* Discover peers
* Peer handshake
* Downloading a simple piece
* Downloading a compelte file
* Basic UI

