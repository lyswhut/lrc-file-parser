/*!
 * lrc-file-parser.js v2.2.9
 * Author: lyswhut
 * Github: https://github.com/lyswhut/lrc-file-parser
 * License: MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Lyric", [], factory);
	else if(typeof exports === 'object')
		exports["Lyric"] = factory();
	else
		root["Lyric"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 579:
/***/ ((module) => {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var timeFieldExp = /^(?:\[[\d:.]+\])+/g;
var timeExp = /[\d:.]+/g;
var timeLabelRxp = /^(\[[\d:]+\.)0+(\d+\])/;
var timeLabelFixRxp = /(?:\.0+|0+)$/;
var tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
};

// eslint-disable-next-line no-undef
var getNow = (typeof performance === "undefined" ? "undefined" : _typeof(performance)) == 'object' && performance.now ? performance.now.bind(performance) : Date.now.bind(Date);

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

var timeoutTools = {
  invokeTime: 0,
  animationFrameId: null,
  timeoutId: null,
  callback: null,
  thresholdTime: 200,
  run: function run() {
    var _this = this;
    this.animationFrameId = window.requestAnimationFrame(function () {
      _this.animationFrameId = null;
      var diff = _this.invokeTime - getNow();
      // console.log('diff', diff)
      if (diff > 0) {
        if (diff < _this.thresholdTime) return _this.run();
        return _this.timeoutId = setTimeout(function () {
          _this.timeoutId = null;
          _this.run();
        }, diff - _this.thresholdTime);
      }

      // console.log('diff', diff)
      _this.callback(diff);
    });
  },
  start: function start() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // console.log(timeout)
    this.callback = callback;
    this.invokeTime = getNow() + timeout;
    this.run();
  },
  clear: function clear() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
};
var parseExtendedLyric = function parseExtendedLyric(lrcLinesMap, extendedLyric) {
  var extendedLines = extendedLyric.split(/\r\n|\n|\r/);
  for (var i = 0; i < extendedLines.length; i++) {
    var line = extendedLines[i].trim();
    var result = timeFieldExp.exec(line);
    if (result) {
      var timeField = result[0];
      var text = line.replace(timeFieldExp, '').trim();
      if (text) {
        var times = timeField.match(timeExp);
        if (times == null) continue;
        var _iterator = _createForOfIteratorHelper(times),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var time = _step.value;
            if (time.includes('.')) time = time.replace(timeLabelRxp, '$1$2');else time += '.0';
            var timeStr = time.replace(timeLabelFixRxp, '');
            var targetLine = lrcLinesMap[timeStr];
            if (targetLine) targetLine.extendedLyrics.push(text);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }
};
module.exports = /*#__PURE__*/function () {
  function Lyric() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$lyric = _ref.lyric,
      lyric = _ref$lyric === void 0 ? '' : _ref$lyric,
      _ref$extendedLyrics = _ref.extendedLyrics,
      extendedLyrics = _ref$extendedLyrics === void 0 ? [] : _ref$extendedLyrics,
      _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? 150 : _ref$offset,
      _ref$onPlay = _ref.onPlay,
      onPlay = _ref$onPlay === void 0 ? function () {} : _ref$onPlay,
      _ref$onSetLyric = _ref.onSetLyric,
      onSetLyric = _ref$onSetLyric === void 0 ? function () {} : _ref$onSetLyric,
      _ref$isRemoveBlankLin = _ref.isRemoveBlankLine,
      isRemoveBlankLine = _ref$isRemoveBlankLin === void 0 ? true : _ref$isRemoveBlankLin;
    _classCallCheck(this, Lyric);
    this.lyric = lyric;
    this.extendedLyrics = extendedLyrics;
    this.tags = {};
    this.lines = null;
    this.onPlay = onPlay;
    this.onSetLyric = onSetLyric;
    this.isPlay = false;
    this.curLineNum = 0;
    this.maxLine = 0;
    this.offset = offset;
    this._performanceTime = 0;
    this._startTime = 0;
    this.isRemoveBlankLine = isRemoveBlankLine;
    this._init();
  }
  _createClass(Lyric, [{
    key: "_init",
    value: function _init() {
      if (this.lyric == null) this.lyric = '';
      if (this.extendedLyrics == null) this.extendedLyrics = [];
      this._initTag();
      this._initLines();
      this.onSetLyric(this.lines);
    }
  }, {
    key: "_initTag",
    value: function _initTag() {
      this.tags = {};
      for (var tag in tagRegMap) {
        var matches = this.lyric.match(new RegExp("\\[".concat(tagRegMap[tag], ":([^\\]]*)]"), 'i'));
        this.tags[tag] = matches && matches[1] || '';
      }
      if (this.tags.offset) {
        var offset = parseInt(this.tags.offset);
        this.tags.offset = Number.isNaN(offset) ? 0 : offset;
      } else {
        this.tags.offset = 0;
      }
    }
  }, {
    key: "_initLines",
    value: function _initLines() {
      this.lines = [];
      var lines = this.lyric.split(/\r\n|\n|\r/);
      var linesMap = {};
      var length = lines.length;
      for (var i = 0; i < length; i++) {
        var line = lines[i].trim();
        var result = timeFieldExp.exec(line);
        if (result) {
          var timeField = result[0];
          var text = line.replace(timeFieldExp, '').trim();
          if (text || !this.isRemoveBlankLine) {
            var times = timeField.match(timeExp);
            if (times == null) continue;
            var _iterator2 = _createForOfIteratorHelper(times),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var time = _step2.value;
                if (time.includes('.')) time = time.replace(timeLabelRxp, '$1$2');else time += '.0';
                var timeStr = time.replace(timeLabelFixRxp, '');
                if (linesMap[timeStr]) {
                  linesMap[timeStr].extendedLyrics.push(text);
                  continue;
                }
                var timeArr = timeStr.split(':');
                if (timeArr.length < 3) timeArr.unshift(0);
                if (timeArr[2].indexOf('.') > -1) {
                  timeArr.push.apply(timeArr, _toConsumableArray(timeArr[2].split('.')));
                  timeArr.splice(2, 1);
                }
                linesMap[timeStr] = {
                  time: parseInt(timeArr[0]) * 60 * 60 * 1000 + parseInt(timeArr[1]) * 60 * 1000 + parseInt(timeArr[2]) * 1000 + parseInt(timeArr[3] || 0),
                  text: text,
                  extendedLyrics: []
                };
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        }
      }
      var _iterator3 = _createForOfIteratorHelper(this.extendedLyrics),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var lrc = _step3.value;
          parseExtendedLyric(linesMap, lrc);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      this.lines = Object.values(linesMap);
      this.lines.sort(function (a, b) {
        return a.time - b.time;
      });
      this.maxLine = this.lines.length - 1;
    }
  }, {
    key: "_currentTime",
    value: function _currentTime() {
      return getNow() - this._performanceTime + this._startTime;
    }
  }, {
    key: "_findCurLineNum",
    value: function _findCurLineNum(curTime) {
      var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      if (curTime <= 0) return 0;
      var length = this.lines.length;
      for (var index = startIndex; index < length; index++) {
        if (curTime <= this.lines[index].time) return index === 0 ? 0 : index - 1;
      }
      return length - 1;
    }
  }, {
    key: "_handleMaxLine",
    value: function _handleMaxLine() {
      this.onPlay(this.curLineNum, this.lines[this.curLineNum].text);
      this.pause();
    }
  }, {
    key: "_refresh",
    value: function _refresh() {
      var _this2 = this;
      this.curLineNum++;
      // console.log('curLineNum time', this.lines[this.curLineNum].time)
      if (this.curLineNum >= this.maxLine) return this._handleMaxLine();
      var curLine = this.lines[this.curLineNum];
      var currentTime = this._currentTime();
      var driftTime = currentTime - curLine.time;
      if (driftTime >= 0 || this.curLineNum === 0) {
        var nextLine = this.lines[this.curLineNum + 1];
        this.delay = nextLine.time - curLine.time - driftTime;
        if (this.delay > 0) {
          if (this.isPlay) {
            timeoutTools.start(function () {
              if (!_this2.isPlay) return;
              _this2._refresh();
            }, this.delay);
          }
          this.onPlay(this.curLineNum, curLine.text);
          return;
        } else {
          var newCurLineNum = this._findCurLineNum(currentTime, this.curLineNum + 1);
          if (newCurLineNum > this.curLineNum) this.curLineNum = newCurLineNum - 1;
          this._refresh();
          return;
        }
      }
      this.curLineNum = this._findCurLineNum(currentTime, this.curLineNum) - 1;
      this._refresh();
    }
  }, {
    key: "play",
    value: function play() {
      var curTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (!this.lines.length) return;
      this.pause();
      this.isPlay = true;
      this._performanceTime = getNow() - parseInt(this.tags.offset + this.offset);
      this._startTime = curTime;
      // this._offset = this.tags.offset + this.offset

      this.curLineNum = this._findCurLineNum(this._currentTime()) - 1;
      this._refresh();
    }
  }, {
    key: "pause",
    value: function pause() {
      if (!this.isPlay) return;
      this.isPlay = false;
      timeoutTools.clear();
      if (this.curLineNum === this.maxLine) return;
      var curLineNum = this._findCurLineNum(this._currentTime());
      if (this.curLineNum !== curLineNum) {
        this.curLineNum = curLineNum;
        this.onPlay(curLineNum, this.lines[curLineNum].text);
      }
    }
  }, {
    key: "setLyric",
    value: function setLyric(lyric, extendedLyrics) {
      // console.log(extendedLyrics)
      if (this.isPlay) this.pause();
      this.lyric = lyric;
      this.extendedLyrics = extendedLyrics;
      this._init();
    }
  }]);
  return Lyric;
}();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(579);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});