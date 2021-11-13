interface lines {
  /**
   * current line play time(ms)
   */
  time: Number,

  /**
   * current line lyric text
   */
  text: String,
}

interface options {
  /**
   * Listening play event
   * @param line line number of current play
   * @param text lyric text of current play line
   */
  onPlay(line: Number, text: String): void;

  /**
   * listening lyrics seting event
   * @param lines array of all lyric text
   */
  onSetLyric(lines: lines[]): void;

  /**
   * offset time(ms), default is 150 ms
   */
  offset: number;

  /**
   * has remove blank line, default is true
   */
  isRemoveBlankLine: boolean;

  /**
   * lyric file text
   */
  lyric: string;

  /**
   * lyric translation file text
   */
  translationLyric: string;
}

declare class Lyric {
  constructor(options: options);
  /**
   * Set lyric
   * @param lyricStr lyric file text
   * @param lyricTranslationStr lyric translation file text
   */
  setLyric(lyricStr: String, lyricTranslationStr?: String): void;

  /**
   * Play lyric
   * @param time play time, unit: ms
   */
  play(time: Number): void;

  /**
   * Pause lyric
   */
  pause(): void;
}

export default Lyric
