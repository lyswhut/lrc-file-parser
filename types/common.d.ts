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
   * @param offset offset time(ms)
   * @param globalOffset global offset time(ms)
   */
  onSetLyric?: (lines: Lines, offset: number, globalOffset: number) => void

  /**
   * global offset time(ms), default is 0 ms
   */
  globalOffset?: number

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
