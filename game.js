// gamejson setting
// "deviceOrientation": "landscape"

const ResourceCtrl = require('./utils/resource-ctrl');
const Canvas = require('./utils/canvas');
const Main   = require('./scene/main');

// window.test = 1;

// 加载资源
let resourceCtrl = new ResourceCtrl();

resourceCtrl.load().then(() => {
    window.resourceCtrl = resourceCtrl;

    new Canvas({ name: 'screen' });

    // 开启主页
    new Main();
});

// test code
// const test = require('./test.js');
// let aa = new test(canvas);

// let aa = require('./test1.js');
// aa.start();

// wx.onTouchStart(function() {
//     aa.toggleRender();
// });

