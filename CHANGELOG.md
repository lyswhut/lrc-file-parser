# lrc-file-parser change log

All notable changes to this project will be documented in this file.

Project versioning adheres to [Semantic Versioning](http://semver.org/).
Commit convention is based on [Conventional Commits](http://conventionalcommits.org).
Change log format is based on [Keep a Changelog](http://keepachangelog.com/).

## [2.4.1](https://github.com/lyswhut/lrc-file-parser/compare/v2.4.0...v2.4.1) - 2023-04-23

- Fix export

## [2.4.0](https://github.com/lyswhut/lrc-file-parser/compare/v2.3.2...v2.4.0) - 2023-04-23

- From Js to Typescript + Modernize the build system (<https://github.com/lyswhut/lrc-file-parser/pull/15>, Thanks @luxluth)

## [2.3.2](https://github.com/lyswhut/lrc-file-parser/compare/v2.3.1...v2.3.2) - 2023-04-22

- Fix time label parse

## [2.3.1](https://github.com/lyswhut/lrc-file-parser/compare/v2.3.0...v2.3.1) - 2023-03-22

- Fix index.d.ts

## [2.3.0](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.9...v2.3.0) - 2023-02-10

- Add playback rate support

## [2.2.9](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.8...v2.2.9) - 2023-02-01

- Fix extended lyrics match

## [2.2.8](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.7...v2.2.8) - 2022-12-08

- Fix match

## [2.2.7](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.6...v2.2.7) - 2022-12-08

- Fix match

## [2.2.6](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.5...v2.2.6) - 2022-12-08

- Fix match

## [2.2.5](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.4...v2.2.5) - 2022-12-08

- Fix

## [2.2.4](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.3...v2.2.4) - 2022-12-08

- Fix match error

## [2.2.3](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.2...v2.2.3) - 2022-12-08

- Fix extendedLyrics time label match

## [2.2.2](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.1...v2.2.2) - 2022-11-25

- Update dev dependencies
- Fix index.d.ts

## [2.2.1](https://github.com/lyswhut/lrc-file-parser/compare/v2.2.0...v2.2.1) - 2022-10-28

Fix index.d.ts

## [2.2.0](https://github.com/lyswhut/lrc-file-parser/compare/v2.1.0...v2.2.0) - 2022-10-28

Support parse single file multilingual lyrics

## [2.1.0](https://github.com/lyswhut/lrc-file-parser/compare/v2.0.0...v2.1.0) - 2022-09-27

Support parse of single line multi time label:

Original text:

```text
[00:09.25][01:02.16][02:06.30]Never gonna make you cry never gonna say goodbye
```

Parsered:

```text
[00:09.25]Never gonna make you cry never gonna say goodbye
[01:02.16]Never gonna make you cry never gonna say goodbye
[02:06.30]Never gonna make you cry never gonna say goodbye
```

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
