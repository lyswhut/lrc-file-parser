# lrc-file-parser

A lrc file parser based javascript

[demo](https://lyswhut.github.io/lrc-file-parser/dist/index.html)

## Installation

- Use npm install

```bash
# install
npm install lrc-file-parser
```

```js
// import
import Lyric from 'lrc-file-parser'
```

- Use script link

```html
<script src="./lrc-file-parser.min.js"></script>
```

## How to use

```js
var lrc = new Lyric({
  onPlay: function (line, text) { // Listening play event
    console.log(line, text) // line is line number of current play
                            // text is lyric text of current play line
  },
  onSetLyric: function (lines, offset, globalOffset) { // listening lyrics seting event
    console.log(lines) // lines is array of all lyric text
  },
  globalOffset: 0, // offset time(ms)
  playbackRate: 1, // playback rate, default is 1
  isRemoveBlankLine: true // is remove blank line, default is true
})

var extendedLyricStrs = [translationLyricStr]
lrc.setLyric(lyricStr, extendedLyricStrs) // set lyric, lyricStr is lyric file text, extendedLyricStrs is extended lyric file text array (optional)
                      // note: Setting the lyrics will automatically pause the lyrics playback
lrc.play(30000) // play lyric, 30000 is curent play time, unit: ms
lrc.pause() // pause lyric

lrc.setPlaybackRate(1.2) // set playback rate to 1.2x

lrc.setOffset(100) // set playback offset to 100
lrc.setGlobalOffset(100) // set playback global offset to 100

```

## CHANGELOG

See [CHANGELOG.md](https://github.com/lyswhut/lrc-file-parser/blob/master/CHANGELOG.md)

## LICENSE

MIT
