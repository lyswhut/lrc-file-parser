import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts',
    ],

    format: ['cjs', 'esm'],
    name: "lfp",
    dts: false,
    outDir: '.',
    outExtension(ctx) {
        if (ctx.format == "iife" && ctx.options.minify) {
            return {js: '.min.js'}
        } else if (ctx.format == "iife" && !ctx.options.minify) {
            return {js: '.js'}
        } else {
            return {}
        }
    },
})