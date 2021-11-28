# webpack-replace-plugin

## 使用

```javascript
const {ReplacePlugin} = require('@stacker/webpack-replace-plugin');

new ReplacePlugin({
  replaceQueue: [{
    reg: /(?<!\.)1991421\.cn/g,
    value: 'window.baseHost',
  }]
})
```
