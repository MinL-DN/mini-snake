// gamejson setting
// "deviceOrientation": "landscape"

require('./utils/libs/weapp-adapter');
const LoadRe = require('./utils/loadRe');
const Main = require('./scene/main');

// 加载资源
new LoadRe().load().then(re => {
    window.resources = re;
    // 开启主页
    new Main();
});
