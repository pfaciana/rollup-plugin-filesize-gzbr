# Filesize for Gzip & Brotli Rollup Plugin

This plugin provides an easy way to calculate and display file sizes for the generated bundles during the build process. It calculates the uncompressed, gzip-compressed, and brotli-compressed sizes of the generated bundles and logs them to the console.

## Installation

You can install the plugin via npm or Yarn:

```shell
npm install rollup-plugin-filesize-gzbr --save-dev
```

or

```shell
yarn add rollup-plugin-filesize-gzbr --dev
```

## Example Usage

```javascript
import filesize from 'rollup-plugin-filesize-gzbr';

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/bundle.js',
	},
	plugins: [
		filesize()
	],
};
```

## Options

The `filesize-gzbr` plugin accepts an optional `options` object with the following properties:

- `types` (string | string[]): Specifies the file types for which the sizes should be calculated. Default: `[]` (calculates sizes for all files). Examples:
    - `'asset'`: Calculates sizes only for asset files.
    - `'chunk'`: Calculates sizes only for chunk files.
    - `['asset', 'chunk']`: Calculates sizes for asset and chunk files.
