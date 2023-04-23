import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import typescript from '@rollup/plugin-typescript'
import fs from 'node:fs'
import path from 'node:path'

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), './package.json')))
const banner = `/**!
* lrc-file-parser.js v${pkg.version}
* Homepage: ${pkg.homepage}
* License: ${pkg.license}
*/`

export default {
  input: 'dist/lrc-file-parser.esm.js',
  output: [
    {
      file: 'dist/lrc-file-parser.min.js',
      format: 'iife',
      name: 'Lyric',
      // sourcemap: true,
      banner,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
    }),
    terser(),
  ],
}
