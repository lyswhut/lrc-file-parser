const timeExp = /^\[([\d|:|\.]*)\]{1}/g
const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

module.exports = class Lyric {
  constructor({ lyric = '', onPlay = function () { }, onSetLyric = function () { } } = {}) {
    this.lyric = lyric
    this.tags = {}
    this.lines = null
    this.onPlay = onPlay
    this.onSetLyric = onSetLyric
    this.isPlay = false
    this.curLineNum = 0
    this.timer = 0
    this.maxLine = 0
    this.offset = 250
    this.isOffseted = false
    this._init()
  }
  _init() {
    if (!this.lyric) return
    this._initTag()
    this._initLines()
    this.onSetLyric(this.lines)
  }
  _initTag() {
    for (let tag in tagRegMap) {
      const matches = this.lyric.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      this.tags[tag] = matches && matches[1] || ''
    }
  }
  _initLines() {
    this.lines = []
    const lines = this.lyric.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      let result = timeExp.exec(line)
      if (result) {
        const text = line.replace(timeExp, '').trim()
        if (text) {
          const timeArr = RegExp.$1.split(':')
          if (timeArr.length < 3) timeArr.unshift(0)
          if (timeArr[2].includes('.')) {
            timeArr.push(...timeArr[2].split('.'))
            timeArr.splice(2, 1)
          }
          this.lines.push({
            time: timeArr[0] * 60 * 60 * 1000 + timeArr[1] * 60 * 1000 + timeArr[2] * 1000 + (timeArr[3] || 0) * 10,
            text
          })
        }
      }
    }
    this.lines.sort((a, b) => {
      return a.time - b.time
    })
    this.maxLine = this.lines.length - 1
  }
  _findCurLineNum(curTime) {
    const length = this.lines.length
    for (let index = 0; index < length; index++) if (curTime <= this.lines[index].time) return index === 0 ? 0 : index - 1
    return length - 1
  }

  _refresh() {
    this.curLineNum++
    this.onPlay(this.curLineNum, this.lines[this.curLineNum].text)
    if (this.curLineNum === this.maxLine) return this.pause()
    this.delay = this.lines[this.curLineNum + 1].time - this.lines[this.curLineNum].time
    if (!this.isOffseted && this.delay >= this.offset) {
      this.delay -= this.offset
      this.isOffseted = true
    }
    this.timer = setTimeout(() => {
      this._refresh()
    }, this.delay)
  }

  play(curTime = 0) {
    if (!this.lines.length) return
    this.pause()
    this.isPlay = true

    this.curLineNum = this._findCurLineNum(curTime)

    this.onPlay(this.curLineNum, this.lines[this.curLineNum].text)

    if (this.curLineNum === this.maxLine) return this.pause()

    this.delay = this.lines[this.curLineNum + 1].time - curTime
    if (this.delay >= this.offset) {
      this.delay -= this.offset
      this.isOffseted = true
    }
    // console.log(this.delay);

    if (this.delay < 0) return
    this.timer = setTimeout(() => {
      this._refresh()
    }, this.delay)
  }
  pause() {
    if (!this.isPlay) return
    clearTimeout(this.timer)
    this.isPlay = false
    this.isOffseted = false
  }
  setLyric(lyric) {
    if (this.isPlay) this.pause()
    this.lyric = lyric
    this._init()
  }
}
