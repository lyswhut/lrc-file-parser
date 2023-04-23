import type { Line } from '../types/common'


export const timeFieldExp = /^(?:\[[\d:.]+\])+/g
export const timeExp = /\d{1,3}(:\d{1,3}){0,2}(?:\.\d{1,3})/g

export type LyricMap = Map<string, string[]>

export const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by',
} as const

export const getNow = typeof performance == 'object' && performance.now ? performance.now.bind(performance) : Date.now.bind(Date)

// const timeoutTools = {
//   expected: 0,
//   interval: 0,
//   timeoutId: null,
//   callback: null,
//   step() {
//     var dt = getNow() - this.expected // the drift (positive for overshooting)
//     if (dt > this.interval) {
//         // something really bad happened. Maybe the browser (tab) was inactive?
//         // possibly special handling to avoid futile "catch up" run
//     }
//     // … // do what is to be done

//     this.callback()

//     this.expected += this.interval
//     this.timeoutId = setTimeout(() => {
//       this.step()
//     }, Math.max(0, this.interval - dt)) // take into account drift
//   },
//   start(callback = () => {}, interval = 1000) {
//     this.callback = callback
//     this.interval = interval
//     this.expected = getNow() + interval
//     this.timeoutId = setTimeout(() => {
//       this.step()
//     } ,interval)
//   },
//   stop() {
//     if (this.timeoutId == null) return
//     clearTimeout(this.timeoutId)
//     this.timeoutId = null
//   }
// }

export const noop = function() {}
export const timeoutTools = {
  invokeTime: 0,
  animationFrameId: null as number | null,
  timeoutId: null as number | null,
  callback: null as ((diffTime: number) => void) | null,
  thresholdTime: 200,

  run() {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.animationFrameId = null
      let diff = this.invokeTime - getNow()
      // console.log('diff', diff)
      if (diff > 0) {
        if (diff < this.thresholdTime) {
          this.run()
          return
        }
        return this.timeoutId = setTimeout(() => {
          this.timeoutId = null
          this.run()
        }, diff - this.thresholdTime)
      }

      // console.log('diff', diff)
      this.callback!(diff)
    })
  },
  start(callback = noop, timeout = 0) {
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
    this.callback = null
  },
}

const t_rxp_1 = /^0+(\d+)/
const t_rxp_2 = /:0+(\d+)/g
const t_rxp_3 = /\.0+(\d+)/
export const formatTimeLabel = (label: string) => {
  return label.replace(t_rxp_1, '$1')
    .replace(t_rxp_2, ':$1')
    .replace(t_rxp_3, '.$1')
}

export const parseExtendedLyric = (lrcLinesMap: Record<string, Line>, extendedLyric: string) => {
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
          const timeStr = formatTimeLabel(time)
          const targetLine = lrcLinesMap[timeStr]
          if (targetLine) targetLine.extendedLyrics.push(text)
        }
      }
    }
  }
}
