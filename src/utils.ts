export const timeFieldExp = /^(?:\[[\d:.]+\])+/g
export const timeExp = /\d{1,3}(:\d{1,3}){0,2}(?:\.\d{1,3})/g

export const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by',
}

export type Lines = {
  /**
   * current line play time(ms)
   */
  time: number

  /**
   * current line lyric text
   */
  text: string

  /**
   * extended lyrics
   */
  extendedLyrics: string[]
}

export type Options = {
  /**
   * Listening play event
   * @param line line number of current play
   * @param text lyric text of current play line
   */
  onPlay(line: number, text: string): void

  /**
   * listening lyrics seting event
   * @param lines array of all lyric text
   */
  onSetLyric(lines: Lines[]): void

  /**
   * offset time(ms), default is 150 ms
   */
  offset?: number

  /**
   * playback rate, default is 1
   */
  playbackRate?: number

  /**
   * has remove blank line, default is true
   */
  isRemoveBlankLine?: boolean

  /**
   * lyric file text
   */
  lyric?: string

  /**
   * lyric translation file text
   */
  translationLyric?: string

  /**
   * extended lyrics 
   */
  extendedLyrics?: string[]
}

export type TT = {
  invokeTime: number,
  animationFrameId: number | null,
  timeoutId: number | null,
  callback: (() => void) | ((diff: number) => void),
  thresholdTime: number,
  run: () => void,
  start: (callback: () => void, timeout: number) => void,
  clear: () => void
}

export const getNow = typeof performance == 'object' && performance.now ? performance.now.bind(performance) : Date.now.bind(Date)

export const timeoutTools: TT = {
  invokeTime: 0,
  animationFrameId: null,
  timeoutId: null,
  callback: () => { },
  thresholdTime: 200,

  run() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.animationFrameId = null
      let diff = this.invokeTime - getNow()
      // console.log('diff', diff)
      if (diff > 0) {
        if (diff < this.thresholdTime) return this.run()
        return this.timeoutId = setTimeout(() => {
          this.timeoutId = null
          this.run()
        }, diff - this.thresholdTime)
      }

      // console.log('diff', diff)
      this.callback(diff)
    })
  },
  start(callback = () => { }, timeout = 0) {
    // console.log(timeout)
    this.callback = callback
    this.invokeTime = getNow() + timeout

    this.run()
  },
  clear() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  },
}

export const t_rxp_1 = /^0+(\d+)/
export const t_rxp_2 = /:0+(\d+)/g
export const t_rxp_3 = /\.0+(\d+)/
export const formaterTimeLabel = (label: string) => {
  return label.replace(t_rxp_1, '$1')
    .replace(t_rxp_2, ':$1')
    .replace(t_rxp_3, '.$1')
}

export type LrcLinesMap = Record<string, Lines>

export const parseExtendedLyric = (lrcLinesMap: LrcLinesMap, extendedLyric: string) => {
  const extendedLines = extendedLyric.split(/\r\n|\n|\r/)
  for (let i = 0; i < extendedLines.length; i++) {
    const line = extendedLines[i].trim()
    let result = timeFieldExp.exec(line)
    if (result) {
      const timeField = result[0]
      const text = line.replace(timeFieldExp, '').trim()
      if (text) {
        const times = timeField.match(timeExp)
        if (times == null) continue
        for (let time of times) {
          const timeStr = formaterTimeLabel(time)
          const targetLine = lrcLinesMap[timeStr]
          if (targetLine) targetLine.extendedLyrics.push(text)
        }
      }
    }
  }
}

export type Tags = {
  title: string,
  artist: string,
  album: string,
  offset: string | number,
  by: string,
}

export type AvailableTags = "title" | "artist" | "album" | "offset" | "by"

