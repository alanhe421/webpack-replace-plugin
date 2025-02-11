const esprima = require('esprima');
const Source = require('webpack-sources');
const colors = require('colors');

const fs = require('fs');
const path = require('path');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

/**
 * 内置替换规则
 */
const DEFAULT_REPLACE_QUEUE = [];

function replaceTextLoader(source, { replaceQueue = [], skipDefault = false } = {
  replaceQueue: [],
  skipDefault: false,
}) {
  const tokenization = esprima.tokenize(source);
  tokenization.forEach((item) => {
    if (item.type !== 'String') return;
    const mark = item.value.charAt(0);
    const {value} = item;
    let res = value;
    replaceQueue.concat(skipDefault ? [] : DEFAULT_REPLACE_QUEUE).forEach((obj) => {
      res = res.replace(obj.reg, `${mark} + ${obj.value} + ${mark}`);
    });
    if (value === res) return;
    source = source.replace(value, res);
  });
  return source;
}

class ReplacePlugin {
  constructor(options = {}) {
    this.name = 'replace-plugin';
    this.options = {
      debug: false,
      ...options,
    };
  }

  apply(compiler) {
    const _this = this;
    compiler.hooks.compilation.tap(_this.name, (compilation) => {
      compilation.hooks.optimizeChunkAssets.tap(_this.name, (chunks) => {
        chunks.forEach((chunk) => {
          chunk.files.forEach((filename) => {
            if (!filename.match(/\.js(\?.+)?$/)) {
              return;
            }
            console.log(`${_this.name} 🧱，${filename} replaced`.info);
            const asset = compilation.assets[filename];
            const sourceStr = asset.source();
            const sourceStrNew = replaceTextLoader(sourceStr, _this.options);
            compilation.assets[filename] = new Source.RawSource(sourceStrNew);
            if (_this.options.debug) {
              const filenameWithoutExt = path.parse(filename).name;
              fs.writeFileSync(`./${filenameWithoutExt}-replaced-before.js`, sourceStr, 'utf8');
              fs.writeFileSync(`./${filenameWithoutExt}-replaced-after.js`, sourceStrNew, 'utf8');
            }
          });
        });
      });
    });
  }
}

module.exports = {
  ReplacePlugin,
  replaceTextLoader,
};
