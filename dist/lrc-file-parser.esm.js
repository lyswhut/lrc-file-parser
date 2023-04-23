const timeFieldExp = /^(?:\[[\d:.]+\])+/g;
const timeExp = /\d{1,3}(:\d{1,3}){0,2}(?:\.\d{1,3})/g;
const tagRegMap = {
    title: 'ti',
    artist: 'ar',
    album: 'al',
    offset: 'offset',
    by: 'by',
};
const getNow = typeof performance == 'object' && performance.now ? performance.now.bind(performance) : Date.now.bind(Date);
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
const noop = function () { };
const timeoutTools = {
    invokeTime: 0,
    animationFrameId: null,
    timeoutId: null,
    callback: null,
    thresholdTime: 200,
    run() {
        this.animationFrameId = window.requestAnimationFrame(() => {
            this.animationFrameId = null;
            let diff = this.invokeTime - getNow();
            // console.log('diff', diff)
            if (diff > 0) {
                if (diff < this.thresholdTime) {
                    this.run();
                    return;
                }
                return this.timeoutId = setTimeout(() => {
                    this.timeoutId = null;
                    this.run();
                }, diff - this.thresholdTime);
            }
            // console.log('diff', diff)
            this.callback(diff);
        });
    },
    start(callback = noop, timeout = 0) {
        // console.log(timeout)
        this.callback = callback;
        this.invokeTime = getNow() + timeout;
        this.run();
    },
    clear() {
        if (this.animationFrameId) {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.callback = null;
    },
};
const t_rxp_1 = /^0+(\d+)/;
const t_rxp_2 = /:0+(\d+)/g;
const t_rxp_3 = /\.0+(\d+)/;
const formatTimeLabel = (label) => {
    return label.replace(t_rxp_1, '$1')
        .replace(t_rxp_2, ':$1')
        .replace(t_rxp_3, '.$1');
};
const parseExtendedLyric = (lrcLinesMap, extendedLyric) => {
    const extendedLines = extendedLyric.split(/\r\n|\n|\r/);
    for (let i = 0; i < extendedLines.length; i++) {
        const line = extendedLines[i].trim();
        let result = timeFieldExp.exec(line);
        if (result) {
            const timeField = result[0];
            const text = line.replace(timeFieldExp, '').trim();
            if (text) {
                const times = timeField.match(timeExp);
                if (times == null)
                    continue;
                for (let time of times) {
                    const timeStr = formatTimeLabel(time);
                    const targetLine = lrcLinesMap[timeStr];
                    if (targetLine)
                        targetLine.extendedLyrics.push(text);
                }
            }
        }
    }
};

const tags = {
    title: '',
    artist: '',
    album: '',
    offset: 0,
    by: '',
};
class Lyric {
    lyric;
    extendedLyrics;
    tags;
    lines;
    onPlay;
    onSetLyric;
    isPlay;
    curLineNum;
    maxLine;
    offset;
    isRemoveBlankLine;
    _playbackRate;
    _performanceTime;
    _startTime;
    constructor({ lyric = '', extendedLyrics = [], offset = 150, playbackRate = 1, onPlay = noop, onSetLyric = noop, isRemoveBlankLine = true, }) {
        this.lyric = lyric;
        this.extendedLyrics = extendedLyrics;
        this.tags = { ...tags };
        this.lines = [];
        this.onPlay = onPlay;
        this.onSetLyric = onSetLyric;
        this.isPlay = false;
        this.curLineNum = 0;
        this.maxLine = 0;
        this.offset = offset;
        this.isRemoveBlankLine = isRemoveBlankLine;
        this._playbackRate = playbackRate;
        this._performanceTime = 0;
        this._startTime = 0;
        this._init();
    }
    _init() {
        if (this.lyric == null)
            this.lyric = '';
        if (this.extendedLyrics == null)
            this.extendedLyrics = [];
        this._initTag();
        this._initLines();
        this.onSetLyric(this.lines);
    }
    _initTag() {
        this.tags = { ...tags };
        for (let tag of Object.keys(tags)) {
            const matches = this.lyric.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'));
            if (matches) {
                // @ts-expect-error
                this.tags[tag] = matches[1];
            }
        }
        if (this.tags.offset) {
            let offset = parseInt(this.tags.offset);
            this.tags.offset = Number.isNaN(offset) ? 0 : offset;
        }
        else {
            this.tags.offset = 0;
        }
    }
    _initLines() {
        this.lines = [];
        const lines = this.lyric.split(/\r\n|\n|\r/);
        const linesMap = {};
        const length = lines.length;
        for (let i = 0; i < length; i++) {
            const line = lines[i].trim();
            let result = timeFieldExp.exec(line);
            if (result) {
                const timeField = result[0];
                const text = line.replace(timeFieldExp, '').trim();
                if (text || !this.isRemoveBlankLine) {
                    const times = timeField.match(timeExp);
                    if (times == null)
                        continue;
                    for (let time of times) {
                        const timeStr = formatTimeLabel(time);
                        if (linesMap[timeStr]) {
                            linesMap[timeStr].extendedLyrics.push(text);
                            continue;
                        }
                        const timeArr = timeStr.split(':');
                        if (timeArr.length > 3)
                            continue;
                        else if (timeArr.length < 3)
                            for (let i = 3 - timeArr.length; i--;)
                                timeArr.unshift('0');
                        if (timeArr[2].includes('.'))
                            timeArr.splice(2, 1, ...timeArr[2].split('.'));
                        linesMap[timeStr] = {
                            time: parseInt(timeArr[0]) * 60 * 60 * 1000 + parseInt(timeArr[1]) * 60 * 1000 + parseInt(timeArr[2]) * 1000 + parseInt(timeArr[3] || '0'),
                            text,
                            extendedLyrics: [],
                        };
                    }
                }
            }
        }
        for (const lrc of this.extendedLyrics)
            parseExtendedLyric(linesMap, lrc);
        this.lines = Object.values(linesMap);
        this.lines.sort((a, b) => {
            return a.time - b.time;
        });
        this.maxLine = this.lines.length - 1;
    }
    _currentTime() {
        return (getNow() - this._performanceTime) * this._playbackRate + this._startTime;
    }
    _findCurLineNum(curTime, startIndex = 0) {
        if (curTime <= 0)
            return 0;
        const length = this.lines.length;
        for (let index = startIndex; index < length; index++)
            if (curTime <= this.lines[index].time)
                return index === 0 ? 0 : index - 1;
        return length - 1;
    }
    _handleMaxLine() {
        this.onPlay(this.curLineNum, this.lines[this.curLineNum].text);
        this.pause();
    }
    _refresh() {
        this.curLineNum++;
        // console.log('curLineNum time', this.lines[this.curLineNum].time)
        if (this.curLineNum >= this.maxLine) {
            this._handleMaxLine();
            return;
        }
        let curLine = this.lines[this.curLineNum];
        const currentTime = this._currentTime();
        const driftTime = currentTime - curLine.time;
        if (driftTime >= 0 || this.curLineNum === 0) {
            let nextLine = this.lines[this.curLineNum + 1];
            const delay = (nextLine.time - curLine.time - driftTime) / this._playbackRate;
            if (delay > 0) {
                if (this.isPlay) {
                    timeoutTools.start(() => {
                        if (!this.isPlay)
                            return;
                        this._refresh();
                    }, delay);
                }
                this.onPlay(this.curLineNum, curLine.text);
            }
            else {
                let newCurLineNum = this._findCurLineNum(currentTime, this.curLineNum + 1);
                if (newCurLineNum > this.curLineNum)
                    this.curLineNum = newCurLineNum - 1;
                this._refresh();
            }
            return;
        }
        this.curLineNum = this._findCurLineNum(currentTime, this.curLineNum) - 1;
        this._refresh();
    }
    play(curTime = 0) {
        if (!this.lines.length)
            return;
        this.pause();
        this.isPlay = true;
        this._performanceTime = getNow() - Math.trunc(this.tags.offset + this.offset);
        this._startTime = curTime;
        // this._offset = this.tags.offset + this.offset
        this.curLineNum = this._findCurLineNum(this._currentTime()) - 1;
        this._refresh();
    }
    pause() {
        if (!this.isPlay)
            return;
        this.isPlay = false;
        timeoutTools.clear();
        if (this.curLineNum === this.maxLine)
            return;
        const curLineNum = this._findCurLineNum(this._currentTime());
        if (this.curLineNum !== curLineNum) {
            this.curLineNum = curLineNum;
            this.onPlay(curLineNum, this.lines[curLineNum].text);
        }
    }
    setPlaybackRate(playbackRate) {
        this._playbackRate = playbackRate;
        if (!this.lines.length)
            return;
        if (!this.isPlay)
            return;
        this.play(this._currentTime());
    }
    setLyric(lyric, extendedLyrics) {
        // console.log(extendedLyrics)
        if (this.isPlay)
            this.pause();
        this.lyric = lyric;
        this.extendedLyrics = extendedLyrics;
        this._init();
    }
}

export { Lyric as default };
