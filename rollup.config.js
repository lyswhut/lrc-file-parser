import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/lrc-file-parser.js',
            format: 'iife',
            name: 'Lyric',
        }
    ],
    plugins: [
        resolve(),
        babel({ babelHelpers: 'bundled' }),
        commonjs(),
        typescript({
            tsconfig: 'tsconfig.json',
        }),
    ],
}