import type { Lines, Options } from '../types/common';
import { tagRegMap } from './utils';
type TagMapKeys = keyof typeof tagRegMap;
type NonNullableOptions = Required<Options>;
interface Tags extends Record<Exclude<TagMapKeys, 'offset'>, string> {
    offset: number;
}
export default class Lyric {
    lyric: NonNullableOptions['lyric'];
    extendedLyrics: NonNullableOptions['extendedLyrics'];
    tags: Tags;
    lines: Lines;
    onPlay: NonNullableOptions['onPlay'];
    onSetLyric: NonNullableOptions['onSetLyric'];
    isPlay: boolean;
    curLineNum: number;
    maxLine: number;
    offset: NonNullableOptions['offset'];
    isRemoveBlankLine: NonNullableOptions['isRemoveBlankLine'];
    private _playbackRate;
    private _performanceTime;
    private _startTime;
    constructor({ lyric, extendedLyrics, offset, playbackRate, onPlay, onSetLyric, isRemoveBlankLine, }: Options);
    private _init;
    private _initTag;
    private _initLines;
    private _currentTime;
    private _findCurLineNum;
    private _handleMaxLine;
    private _refresh;
    /**
     * Play lyric
     * @param time play time, unit: ms
     */
    play(curTime?: number): void;
    /**
     * Pause lyric
     */
    pause(): void;
    /**
     * Set playback rate
     * @param playbackRate playback rate
     */
    setPlaybackRate(playbackRate: NonNullableOptions['playbackRate']): void;
    /**
     * Set lyric
     * @param lyricStr lyric file text
     * @param extendedLyricStrs extended lyric file text array, for example lyric translations
     */
    setLyric(lyric: NonNullableOptions['lyric'], extendedLyrics?: NonNullableOptions['extendedLyrics']): void;
}
export type * from '../types/common';
