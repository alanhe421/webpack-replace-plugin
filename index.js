const esprima = require('esprima');
const Source = require('webpack-sources')
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
  error: 'red'
});

function replaceTxtLoader(source, replaceQueue) {
  const tokenization = esprima.tokenize(source);
  tokenization.forEach((item) => {
    if (item.type !== 'String') return;
    const mark = item.value.charAt(0);
    const {value} = item;
    let res = value;
    replaceQueue.forEach((obj) => {
      res = res.replace(obj.reg, `${mark} + ${obj.value} + ${mark}`);
    });
    if (value === res) return;
    source = source.replace(value, res);
  });
  return source;
}

class ReplacePlugin {
  constructor(options = {}) {
    this.name = 'domain-replace-plugin';
    this.options = options;
    if (!Array.isArray(this.options.replaceQueue) || this.options.replaceQueue.length === 0) {
      console.log('')
      throw 'error';
    }
  }

  apply(compiler) {
    let _this = this;
    compiler.hooks.compilation.tap(_this.name, compilation => {
      compilation.hooks.optimizeChunkAssets.tap(_this.name, chunks => {
        chunks.forEach(chunk => {
          chunk.files.forEach(filename => {
            if (!filename.match(/\.js(\?.+)?$/)) {
              return;
            }
            console.log(`${_this.name} 🧱，${filename} replaced`.info);
            let asset = compilation.assets[filename];
            let sourceStr = asset.source();
            let sourceStrNew = replaceTxtLoader(sourceStr, this.options.replaceQueue);
            compilation.assets[filename] = new Source.RawSource(sourceStrNew);
            if (this.options.debug) {
              const filenameWithoutExt = path.parse(filename).name;
              fs.writeFileSync(`./${filenameWithoutExt}-replaced-before.js`, sourceStr, 'utf8');
              fs.writeFileSync(`./${filenameWithoutExt}-replaced-after.js`, sourceStrNew, 'utf8');
            }
          })
        })
      })
    })
  }
}

module.exports = {
  ReplacePlugin
}
