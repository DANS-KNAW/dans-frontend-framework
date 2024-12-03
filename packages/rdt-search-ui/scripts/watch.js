import esbuild from 'esbuild';
import CssModulesPlugin from 'esbuild-css-modules-plugin';

const context = await esbuild.context({
    bundle: true,
    outdir: 'build',
    outbase: 'src',
    format: 'esm',
    sourcemap: true,
    entryPoints: [
        "src/index.tsx",
        "src/facets/list/view/index.tsx",
        "src/facets/map/view/index.tsx",
        "src/facets/chart/view/index.tsx",
    ],
    external: ['react', 'styled-components'],
    plugins: [
        CssModulesPlugin({
            force: true,
            emitDeclarationFile: true,
            localsConvention: 'camelCaseOnly',
            namedExports: true,
            inject: false
        }),
        {
            name: 'my-plugin',
            setup(build) {
                let count = 0;
                build.onEnd(result => {
                    if (result.errors.length === 0) {
                        console.log('Build succes!', new Date().toLocaleTimeString())
                    }
                });
            },
        }
    ],
})

await context.watch()
