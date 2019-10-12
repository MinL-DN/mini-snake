const Canvas = require('../utils/canvas');

const circlePool = {};

/**
 * 离屏渲染基础圆
 *
 * @param {*} params
 * @param {*} params.radius
 * @param {*} params.radius
 * @param {*} params.border
 * @returns
 */
module.exports = function(params) {

    let { radius = 0, color = '#000000', border = 0 } = params;

    if (!radius) return console.log('circle no raduis');

    let key = `circle-${radius}-${color}-${border}`;

    if (!circlePool[key]) {
        // 离屏渲染
        let circleCanvas = new Canvas({
            name  : 'circle',
            wh    : [radius, radius],
            toImg : true
        });

        // circleCanvas.dom({
        //     position : [0, 0],
        //     size     : ['full', 'full'],
        //     bg       : 'rgba(255,0,0,0.1)',
        //     zoom     : -1
        // });

        circleCanvas.dom({
            bg       : color,
            name     : 'base-circle',
            position : [0, 0],
            size     : [radius, radius],
            radius   : radius,
            border,
            zoom     : 1
        });

        // 直接用离屏的canvas部分机型依旧存在掉帧现象，需要将canvas转为img再画上画布
        circleCanvas.promise = window.resourceCtrl.add(key, circleCanvas.ctx.canvas.toDataURL());
        circleCanvas.img = window.resourceCtrl.re[key];
        circlePool[key] = circleCanvas;
    }

    return circlePool[key];
};
