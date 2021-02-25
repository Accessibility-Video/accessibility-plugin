import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { createFilter } from '@rollup/pluginutils';
import { emptyDir } from 'fs-extra';
import { rollup } from 'rollup';
import { chromeExtension } from 'rollup-plugin-chrome-extension';
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

    const accessibleResources = createFilter([
        'src/video-accessibility.ts',
    ]);

    const plugins = [
        typescript({ tsconfig: tsconfig }),
        nodeResolve(),
    ];

    if (commandLineArgs.environment === 'production') {
        plugins.push(terser({
            format: {
                comments: false,
            },
        }));
    }

    config.plugins.push(
        {
            name: 'accessible-resources',
            resolveId(source, importer) {
                if (!importer && accessibleResources(source)) {
                    // this signals that rollup should not ask other
                    // plugins or check the file system to find this id.
                    return source;
                }
                return null;
            },
            async load(id) {
                if (!accessibleResources(id)) return null;

                const bundle = await rollup({
                    input: id,
                    plugins: plugins,
                });

                bundle.watchFiles.forEach((file) => {
                    this.addWatchFile(file);
                });

                // Change output format so we can inject this in websites
                const generator = await bundle.generate({
                    format: 'iife',
                    preserveModules: false,
                });

                return generator.output[0].code;
            },

        },
        ...plugins,
        commonjs(),
    );

    return config;
}
