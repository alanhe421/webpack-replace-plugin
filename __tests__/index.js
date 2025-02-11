const {replaceTextLoader} = require('../index');

test('关键词替换', () => {
  const source = 'const desc="你觉得腾讯云怎么样啊？相对阿里云，我觉得腾讯云不错。"';
  const target = replaceTextLoader(source, {
    replaceQueue: [{
      reg: /腾讯云/g,
      value: '""'
    }]
  });
  expect(target).toEqual('const desc="你觉得" + "" + "怎么样啊？相对阿里云，我觉得" + "" + "不错。"');
});


test('域名变动', () => {
  const source = 'var link="//1991421.cn/document/product/213/30265";';
  const target = replaceTextLoader(source,{
    replaceQueue:[
      {
        reg: /1991421\.cn/g,
        value: 'window.T_HOST'
      }
    ]
  });
  expect(target).toEqual('var link="//" + window.T_HOST + "/document/product/213/30265";');
});
