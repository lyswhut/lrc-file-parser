/*!
 * lrc-file-parser.js v1.1.4
 * Author: lyswhut
 * Github: https://github.com/lyswhut/lrc-file-parser
 * License: MIT
 */
!function(i,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Lyric",[],t):"object"==typeof exports?exports.Lyric=t():i.Lyric=t()}(self,(function(){return(()=>{var i={579:(i,t,e)=>{var n;function r(i){return function(i){if(Array.isArray(i))return s(i)}(i)||function(i){if("undefined"!=typeof Symbol&&null!=i[Symbol.iterator]||null!=i["@@iterator"])return Array.from(i)}(i)||function(i,t){if(!i)return;if("string"==typeof i)return s(i,t);var e=Object.prototype.toString.call(i).slice(8,-1);"Object"===e&&i.constructor&&(e=i.constructor.name);if("Map"===e||"Set"===e)return Array.from(i);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return s(i,t)}(i)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(i,t){(null==t||t>i.length)&&(t=i.length);for(var e=0,n=new Array(t);e<t;e++)n[e]=i[e];return n}function o(i,t){if(!(i instanceof t))throw new TypeError("Cannot call a class as a function")}function a(i,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,n.key,n)}}function u(i){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(i){return typeof i}:function(i){return i&&"function"==typeof Symbol&&i.constructor===Symbol&&i!==Symbol.prototype?"symbol":typeof i})(i)}i=e.nmd(i);var l=/^\[([\d:.]*)\]{1}/g,h={title:"ti",artist:"ar",album:"al",offset:"offset",by:"by"},f="object"==("undefined"==typeof performance?"undefined":u(performance))&&performance.now?performance.now.bind(performance):Date.now.bind(Date),c={invokeTime:0,animationFrameId:null,timeoutId:null,callback:null,thresholdTime:200,run:function(){var i=this;this.animationFrameId=window.requestAnimationFrame((function(){i.animationFrameId=null;var t=i.invokeTime-f();if(t>0)return t<i.thresholdTime?i.run():i.timeoutId=setTimeout((function(){i.timeoutId=null,i.run()}),t-i.thresholdTime);i.callback(t)}))},start:function(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.callback=i,this.invokeTime=f()+t,this.run()},clear:function(){this.animationFrameId&&(window.cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.timeoutId&&(window.clearTimeout(this.timeoutId),this.timeoutId=null)}},m=function(){function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.lyric,n=void 0===e?"":e,r=t.translationLyric,s=void 0===r?"":r,a=t.offset,u=void 0===a?150:a,l=t.onPlay,h=void 0===l?function(){}:l,f=t.onSetLyric,c=void 0===f?function(){}:f,m=t.isRemoveBlankLine,y=void 0===m||m;o(this,i),this.lyric=n,this.translationLyric=s,this.tags={},this.lines=null,this.onPlay=h,this.onSetLyric=c,this.isRemoveBlankLine=y,this.isPlay=!1,this.curLineNum=0,this.maxLine=0,this.offset=u,this.isOffseted=!1,this._performanceTime=0,this._performanceOffsetTime=0,this._init()}var t,e,n;return t=i,(e=[{key:"_init",value:function(){null==this.lyric&&(this.lyric=""),null==this.translationLyric&&(this.translationLyric=""),this._initTag(),this._initLines(),this.onSetLyric(this.lines)}},{key:"_initTag",value:function(){for(var i in h){var t=this.lyric.match(new RegExp("\\[".concat(h[i],":([^\\]]*)]"),"i"));this.tags[i]=t&&t[1]||""}}},{key:"_initLines",value:function(){this.lines=[];for(var i=this.lyric.split(/\r\n|\n|\r/),t={},e=i.length,n=0;n<e;n++){var s=this.isRemoveBlankLine?i[n].trim():i[n];if(l.exec(s)){var o=this.isRemoveBlankLine?s.replace(l,"").trim():s.replace(l,"");if(o){var a=RegExp.$1,u=a.split(":");u.length<3&&u.unshift(0),u[2].indexOf(".")>-1&&(u.push.apply(u,r(u[2].split("."))),u.splice(2,1)),t[a]={time:60*parseInt(u[0])*60*1e3+60*parseInt(u[1])*1e3+1e3*parseInt(u[2])+parseInt(u[3]||0),text:o}}}}for(var h=this.translationLyric.split("\n"),f=0;f<h.length;f++){var c=this.isRemoveBlankLine?h[f].trim():h[f];if(l.exec(c)){var m=this.isRemoveBlankLine?c.replace(l,"").trim():c.replace(l,"");if(m){var y=t[RegExp.$1];y&&(y.translation=m)}}}this.lines=Object.values(t),this.lines.sort((function(i,t){return i.time-t.time})),this.maxLine=this.lines.length-1}},{key:"_currentTime",value:function(){return f()-this._performanceTime+this._performanceOffsetTime}},{key:"_findCurLineNum",value:function(i){for(var t=this.lines.length,e=0;e<t;e++)if(i<=this.lines[e].time)return 0===e?0:e-1;return t-1}},{key:"_handleMaxLine",value:function(){this.onPlay(this.curLineNum,this.lines[this.curLineNum].text),this.pause()}},{key:"_refresh",value:function(){var i=this;if(this.curLineNum++,this.curLineNum>=this.maxLine)return this._handleMaxLine();var t=this.lines[this.curLineNum],e=this.lines[this.curLineNum+1],n=this._currentTime(),r=n-t.time;if((r>=0||0===this.curLineNum)&&(this.delay=e.time-t.time-r,this.delay>0))return!this.isOffseted&&this.delay>=this.offset&&(this._performanceOffsetTime+=this.offset,this.delay-=this.offset,this.isOffseted=!0),c.start((function(){i._refresh()}),this.delay),void this.onPlay(this.curLineNum,t.text);this.curLineNum=this._findCurLineNum(n)-1,this._refresh()}},{key:"play",value:function(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.lines.length&&(this.pause(),this.isPlay=!0,this._performanceOffsetTime=0,this._performanceTime=f()-i,this._performanceTime<0&&(this._performanceOffsetTime=-this._performanceTime,this._performanceTime=0),this.curLineNum=this._findCurLineNum(i)-1,this._refresh())}},{key:"pause",value:function(){if(this.isPlay&&(this.isPlay=!1,this.isOffseted=!1,c.clear(),this.curLineNum!==this.maxLine)){var i=this._findCurLineNum(this._currentTime());this.curLineNum!==i&&(this.curLineNum=i,this.onPlay(i,this.lines[i].text))}}},{key:"setLyric",value:function(i,t){this.isPlay&&this.pause(),this.lyric=i,this.translationLyric=t,this._init()}}])&&a(t.prototype,e),n&&a(t,n),i}();"object"===u(i)&&"object"===u(i.exports)&&(i.exports=m),void 0===(n=function(){return m}.apply(t,[]))||(i.exports=n)}},t={};function e(n){var r=t[n];if(void 0!==r)return r.exports;var s=t[n]={id:n,loaded:!1,exports:{}};return i[n](s,s.exports,e),s.loaded=!0,s.exports}return e.nmd=i=>(i.paths=[],i.children||(i.children=[]),i),e(579)})()}));