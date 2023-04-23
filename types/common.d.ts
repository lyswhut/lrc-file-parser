export declare interface Line {
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

export declare type Lines = Line[]

export declare interface Options {
  /**
   * Listening play event
   * @param line line number of current play
   * @param text lyric text of current play line
   */
  onPlay?: (line: number, text: string) => void

  /**
   * listening lyrics seting event
   * @param lines array of all lyric text
   */
  onSetLyric?: (lines: Lines) => void

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
  extendedLyrics?: string[]
}
