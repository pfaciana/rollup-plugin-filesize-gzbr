import {normalizePath} from '@rollup/pluginutils';
import path from 'path';
import {filesize} from "filesize";
import {gzipSizeSync} from 'gzip-size';
import {sync as brotliSize} from 'brotli-size';
import chalk from 'chalk';

function outputSizes(bundleFile, outputFile, content) {
	const filename = outputFile.includes(bundleFile) ? outputFile : `${bundleFile} (${outputFile})`;
	const uc = content.length;
	const gz = gzipSizeSync(content, {level: 9});
	const br = brotliSize(content, {level: 11});

	console.log(`\n${chalk.bold.yellow(filename)}`);
	console.log(`${chalk.magenta('uncompressed: ')}${chalk.cyan(filesize(uc, {round: 1}))}`);
	console.log(`${chalk.magenta('gzip: ')}${chalk.cyan(filesize(gz, {round: 1}))}`);
	console.log(`${chalk.magenta('brotli: ')}${chalk.cyan(filesize(br, {round: 1}))}`);
}

function getRelativePath(absolutePath, relativeTo = process.cwd()) {
	absolutePath = normalizePath(path.normalize(absolutePath));
	relativeTo = normalizePath(path.normalize(relativeTo));
	return normalizePath(path.relative(relativeTo, absolutePath));
}

export default function filesizeGzBr(options = {}) {
	let {types = []} = options;
	types = Array.isArray(types) ? types : [types];

	return {
		name: 'rollup-plugin-filesize-gzbr',

		async buildStart(opts) {
			if (!types.length && opts.plugins.some(plugin => plugin.name === 'input-with-css')) {
				types = ['asset'];
			}
		},

		async writeBundle(outputOptions, bundle) {
			const outputFile = normalizePath(path.normalize(outputOptions.file));
			const outputRel = getRelativePath(outputFile);

			const files = Object.values(bundle).filter(({type}) => types.length === 0 ? true : types.includes(type));
			for (const file of files) {
				const content = 'source' in file ? file.source : ('code' in file ? file.code : false);
				content && outputSizes(normalizePath(file.fileName), outputRel, content)
			}
		},
	};
}
