# webpack-replace-plugin

## 使用


⚠️`仅支持生产模式打包`

```javascript
const {ReplacePlugin} = require('@stacker/webpack-replace-plugin');

// 替换为JS对象
new ReplacePlugin({
  replaceQueue: [{
    reg: /(?<!\.)1991421\.cn/g,
    value: 'window.baseHost',
  }]
})

// 替换为JS字符串
new ReplacePlugin({
  replaceQueue: [{
    reg: /(?<!\.)1991421\.cn/g,
    value: '"baseHost"',
  }]
})
```
