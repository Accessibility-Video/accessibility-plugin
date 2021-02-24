import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { emptyDir } from 'fs-extra';
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

export default commandLineArgs => {
    const config = {
        input: 'src/manifest.json',
        output: {
            dir: 'dist',
            format: 'es',
            sourcemap: false,
        },
        plugins: [
            {
                name: 'empty-dir',
                async renderStart({ dir }) {
                    if (dir) {
                        await emptyDir(dir);
                    }
                },
            },
            chromeExtension({ browserPolyfill: true }),
            copy({
                hook: 'generateBundle',
                targets: [
                    { src: 'src/_locales', dest: 'dist' },
                    { src: 'src/assets/style/variables.css', dest: 'dist/assets/style' },
                ],
            }),
        ],
    };

    let tsconfig = 'tsconfig.json';
    if (commandLineArgs.environment === 'development') {
        tsconfig = 'tsconfig.dev.json';
        config.output.sourcemap = 'inline';
    }

    config.plugins.push(
        typescript({ tsconfig: tsconfig }),
        nodeResolve(),
        commonjs(),
    );

    if (commandLineArgs.environment === 'development') {
        config.plugins.push(simpleReloader());
    }

    if (commandLineArgs.environment === 'production') {
        config.plugins.push(terser({
            format: {
                comments: false,
            },
        }));
    }

    return config;
}
