import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'


export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/lrc-file-parser.js',
      format: 'cjs',
    },
    {
      file: 'dist/lrc-file-parser.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      outDir: './',
    }),
    resolve(),
    commonjs(),
  ],
}
