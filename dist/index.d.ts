import type { Line, Options } from '../types/common';
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
    lines: Line[];
    onPlay: NonNullableOptions['onPlay'];
    onSetLyric: NonNullableOptions['onSetLyric'];
    isPlay: boolean;
    curLineNum: number;
    maxLine: number;
    offset: NonNullableOptions['offset'];
    isRemoveBlankLine: NonNullableOptions['isRemoveBlankLine'];
    _playbackRate: NonNullableOptions['playbackRate'];
    _performanceTime: number;
    _startTime: number;
    constructor({ lyric, extendedLyrics, offset, playbackRate, onPlay, onSetLyric, isRemoveBlankLine, }: Options);
    _init(): void;
    _initTag(): void;
    _initLines(): void;
    _currentTime(): number;
    _findCurLineNum(curTime: number, startIndex?: number): number;
    _handleMaxLine(): void;
    _refresh(): void;
    play(curTime?: number): void;
    pause(): void;
    setPlaybackRate(playbackRate: NonNullableOptions['playbackRate']): void;
    setLyric(lyric: NonNullableOptions['lyric'], extendedLyrics: NonNullableOptions['extendedLyrics']): void;
}
export {};
