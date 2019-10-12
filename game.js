// gamejson setting
// "deviceOrientation": "landscape"

require('./utils/libs/weapp-adapter');
require('./utils/libs/symbol');
const LoadRe = require('./utils/loadRe');
const Canvas = require('./utils/canvas');
const Main   = require('./scene/main');

// 加载资源
let loadRe = new LoadRe();

// window.test = 1;

loadRe.load().then(re => {

    window.resources = re;

    new Canvas({ name: 'screen', _canvas: canvas });

    // 开启主页
    new Main();
});

// const test   = require('./test.js');

// let aa = new test(canvas);

// wx.onTouchStart(function() {
//     aa.toggleRender();
// });

