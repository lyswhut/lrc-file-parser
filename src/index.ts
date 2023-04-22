/*!
 * lrc-file-parser.js v2.3.2
 * Author: lyswhut
 * Github: https://github.com/lyswhut/lrc-file-parser
 * License: MIT
 */

import {
  type Lines,
  type Options,
  type LrcLinesMap,
  type Tags,
  type AvailableTags,
  getNow,
  timeoutTools,
  parseExtendedLyric,
  tagRegMap,
  timeFieldExp,
  timeExp,
  formaterTimeLabel
} from './utils'

export default class Lyric {
  lyric: string
  extendedLyrics: string[]
  tags: Tags
  lines: Lines[]
  onPlay: (line: number, text: string) => void
  onSetLyric: (lines: Lines[]) => void
  isPlay: boolean
  curLineNum: number
  maxLine: number
  offset: number
  _playbackRate: number
  _performanceTime: number
  _startTime: number
  isRemoveBlankLine: boolean
  constructor({ lyric = '', extendedLyrics = [], offset = 150, playbackRate = 1, onPlay = function () { }, onSetLyric = function () { }, isRemoveBlankLine = true } = {} as Options) {
    this.lyric = lyric
    this.extendedLyrics = extendedLyrics
    this.tags = {
      title: "",
      artist: "",
      album: "",
      offset: "",
      by: ""
    }
    this.lines = []
    this.onPlay = onPlay
    this.onSetLyric = onSetLyric
    this.isPlay = false
    this.curLineNum = 0
    this.maxLine = 0
    this.offset = offset
    this._playbackRate = playbackRate
    this._performanceTime = 0
    this._startTime = 0
    this.isRemoveBlankLine = isRemoveBlankLine
    this._init()
  }

  _init() {
    if (this.lyric == null) this.lyric = ''
    if (this.extendedLyrics == null) this.extendedLyrics = []
    this._initTag()
    this._initLines()
    this.onSetLyric(this.lines as Lines[])
  }

  _initTag() {
    this.tags = {
      title: "",
      artist: "",
      album: "",
      offset: "",
      by: ""
    }
    for (let tag in tagRegMap) {
      const matches = this.lyric.match(new RegExp(`\\[${tagRegMap[tag as AvailableTags]}:([^\\]]*)]`, 'i'))
      this.tags[tag as AvailableTags] = (matches && matches[1]) || ''
    }
    if (this.tags.offset) {
      let offset = parseInt(this.tags.offset as string)
      this.tags.offset = Number.isNaN(offset) ? 0 : offset
    } else {
      this.tags.offset = 0
    }
  }

  _initLines() {
    this.lines = []
    const lines = this.lyric.split(/\r\n|\n|\r/)
    const linesMap: LrcLinesMap = {}
    const length = lines.length
    for (let i = 0; i < length; i++) {
      const line = lines[i].trim()
      let result = timeFieldExp.exec(line)
      if (result) {
        const timeField = result[0]
        const text = line.replace(timeFieldExp, '').trim()
        if (text || !this.isRemoveBlankLine) {
          const times = timeField.match(timeExp)
          if (times == null) continue
          for (let time of times) {
            const timeStr = formaterTimeLabel(time)
            if (linesMap[timeStr]) {
              linesMap[timeStr].extendedLyrics.push(text)
              continue
            }
            const timeArr = timeStr.split(':')
            if (timeArr.length > 3) continue
            else if (timeArr.length < 3) for (let i = 3 - timeArr.length; i--;) timeArr.unshift('0')
            if (timeArr[2].indexOf('.') > -1) timeArr.splice(2, 1, ...timeArr[2].split('.'))

            linesMap[timeStr] = {
              time: parseInt(timeArr[0]) * 60 * 60 * 1000 + parseInt(timeArr[1]) * 60 * 1000 + parseInt(timeArr[2]) * 1000 + parseInt(timeArr[3] || "0"),
              text,
              extendedLyrics: [],
            }
          }
        }
      }
    }

    for (const lrc of this.extendedLyrics) parseExtendedLyric(linesMap, lrc)
    this.lines = Object.values(linesMap)
    this.lines.sort((a, b) => {
      return a.time - b.time
    })
    this.maxLine = this.lines.length - 1
  }

  _currentTime() {
    return (getNow() - this._performanceTime) * this._playbackRate + this._startTime
  }

  _findCurLineNum(curTime: number, startIndex = 0) {
    if (curTime <= 0) return 0
    const length = this.lines?.length || 0
    for (let index = startIndex; index < length; index++) if (curTime <= this.lines[index].time) return index === 0 ? 0 : index - 1
    return length - 1
  }

  _handleMaxLine() {
    this.onPlay(this.curLineNum, this.lines[this.curLineNum].text)
    this.pause()
  }

  _refresh() {
    this.curLineNum++
    // console.log('curLineNum time', this.lines[this.curLineNum].time)
    if (this.curLineNum >= this.maxLine) return this._handleMaxLine()

    let curLine = this.lines[this.curLineNum]

    const currentTime = this._currentTime()
    const driftTime = currentTime - curLine.time

    if (driftTime >= 0 || this.curLineNum === 0) {
      let nextLine = this.lines[this.curLineNum + 1]
      const delay = (nextLine.time - curLine.time - driftTime) / this._playbackRate

      if (delay > 0) {
        if (this.isPlay) {
          timeoutTools.start(() => {
            if (!this.isPlay) return
            this._refresh()
          }, delay)
        }
        this.onPlay(this.curLineNum, curLine.text)
      } else {
        let newCurLineNum = this._findCurLineNum(currentTime, this.curLineNum + 1)
        if (newCurLineNum > this.curLineNum) this.curLineNum = newCurLineNum - 1
        this._refresh()
      }
      return
    }

    this.curLineNum = this._findCurLineNum(currentTime, this.curLineNum) - 1
    this._refresh()
  }

  /**
   * Play lyric
   * @param time play time, unit: ms
   */
  play(curTime = 0) {
    if (!this.lines.length) return
    this.pause()
    this.isPlay = true

    this._performanceTime = getNow() - parseInt((this.tags.offset as number + this.offset).toString())
    this._startTime = curTime
    // this._offset = this.tags.offset + this.offset

    this.curLineNum = this._findCurLineNum(this._currentTime()) - 1

    this._refresh()
  }

  /**
   * Pause lyric
   */
  pause() {
    if (!this.isPlay) return
    this.isPlay = false
    timeoutTools.clear()
    if (this.curLineNum === this.maxLine) return
    const curLineNum = this._findCurLineNum(this._currentTime())
    if (this.curLineNum !== curLineNum) {
      this.curLineNum = curLineNum
      this.onPlay(curLineNum, this.lines[curLineNum].text)
    }
  }

  /**
   * Set playback rate
   * @param playbackRate playback rate
   */
  setPlaybackRate(playbackRate: number) {
    this._playbackRate = playbackRate
    if (!this.lines.length) return
    if (!this.isPlay) return
    this.play(this._currentTime())
  }

  /**
   * Set lyric
   * @param lyricStr lyric file text
   * @param extendedLyricStrs extended lyric file text array, for example lyric translations
   */
  setLyric(lyric: string, extendedLyrics: string[] = []) {
    // console.log(extendedLyrics)
    if (this.isPlay) this.pause()
    this.lyric = lyric
    this.extendedLyrics = extendedLyrics
    this._init()
  }
}
