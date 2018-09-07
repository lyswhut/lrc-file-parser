# lrc-parser
A lrc file parser based javascript

[demo](http://www.stsky.cn/demo/lrc-parser/)

## How to use
```js
var lrc = new Lyric({
  onPlay: function (line, text) { // Listening play event
    console.log(line, text) // line is line number of current play
                            // text is lyric text of current play line
  },
  onSetLyric: function (lines) { // listening lyrics seting event
    console.log(lines) // lines is array of all lyric text
  }
})
lrc.setLyric(lyricStr) // set lyric, lyricStr is lyric file text
                      // note: Setting the lyrics will automatically pause the lyrics playback
lrc.play(30000) // play lyric, 30000 is curent play time, unit: ms
lrc.pause() // pause lyric
```

## LICENSE
MIT
