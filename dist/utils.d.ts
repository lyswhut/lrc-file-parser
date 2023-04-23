import type { Line } from '../types/common';
export declare const timeFieldExp: RegExp;
export declare const timeExp: RegExp;
export type LyricMap = Map<string, string[]>;
export declare const tagRegMap: {
    readonly title: "ti";
    readonly artist: "ar";
    readonly album: "al";
    readonly offset: "offset";
    readonly by: "by";
};
export declare const getNow: () => number;
export declare const noop: () => void;
export declare const timeoutTools: {
    invokeTime: number;
    animationFrameId: number | null;
    timeoutId: number | null;
    callback: ((diffTime: number) => void) | null;
    thresholdTime: number;
    run(): void;
    start(callback?: () => void, timeout?: number): void;
    clear(): void;
};
export declare const formatTimeLabel: (label: string) => string;
export declare const parseExtendedLyric: (lrcLinesMap: Record<string, Line>, extendedLyric: string) => void;
