import { cac } from 'cac';
import { execa } from 'execa';
import * as path from 'node:path';
import { fileURLToPath } from 'url';
const cli = cac('vue-sfc-codemod');
const transformerDirectory = fileURLToPath(new URL('../transformations', import.meta.url));
const BUILTIN_TRANSFORMERS = ['delight-upgrade', 'script-setup-ts'];
cli
    .command('<transform> <path> [...options]', 'Codemods for Vue SFCs', {
    allowUnknownOptions: true,
})
    .action((transform, path, options) => {
    runTransform({
        files: path,
        transformer: transform,
    });
});
cli.version('0.0.1');
cli.parse();
async function runTransform({ files, transformer, }) {
    let args = [];
    args.push('--verbose=2');
    args.push(`--ignore-pattern='**/node_modules/**'`);
    args.push('--extensions=js,jsx,ts,tsx,vue');
    if (BUILTIN_TRANSFORMERS.includes(transformer)) {
        const transformerPath = path.resolve(transformerDirectory, `${transformer}.ts`);
        args.push('--transform', transformerPath);
    }
    args = args.concat(files);
    console.log('Executing command:', `jscodeshift ${args.join(' ')}\n`);
    await execa('jscodeshift', args, { stdout: 'inherit', preferLocal: true });
}
