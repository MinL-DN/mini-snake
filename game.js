// gamejson setting
// "deviceOrientation": "landscape"

require('./utils/libs/weapp-adapter');
require('./utils/libs/symbol');

const ctx = canvas.getContext('2d');
const { antiAliasing } = require('./utils/index');
const LoadRe = require('./utils/loadRe');
const Main = require('./scene/main');

// 加载资源
let loadRe = new LoadRe();

loadRe.load().then(re => {

    // ctx.test = 1;
    ctx.resources = re;

    // 抗锯齿处理
    antiAliasing(ctx);

    // 开启主页
    new Main(ctx);
});
