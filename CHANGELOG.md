# lrc-file-parser change log

All notable changes to this project will be documented in this file.

Project versioning adheres to [Semantic Versioning](http://semver.org/).
Commit convention is based on [Conventional Commits](http://conventionalcommits.org).
Change log format is based on [Keep a Changelog](http://keepachangelog.com/).

## [2.0.0](https://github.com/lyswhut/lrc-file-parser/compare/v1.2.7...v2.0.0) - 2022-05-10

### BREAKING CHANGE

The input parameter of `setLyric` has been modified, the original `lyricTranslationStr` parameter has been changed to `extendedLyricStrs`, and now it supports the parsing of various lyrics

```js
/**
 * Set lyric
 * @param lyricStr lyric file text
 * @param extendedLyricStrs extended lyric file text array, for example lyric translations
 */
setLyric(lyricStr: String, extendedLyricStrs?: []): void;

// lrc.setLyric(lyricStr, [translationStr1, translationStr2, ...])


/**
 * listening lyrics seting event
 * @param lines array of all lyric text
 */
onSetLyric(lines: lines[{ time, text, extendedLyrics }]): void;

```
