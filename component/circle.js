
const Canvas = require('../utils/canvas');

const circlePool = [];

/**
 * 离屏渲染基础圆
 *
 * @param {*} params
 * @param {*} params.radius
 * @param {*} params.color
 * @returns
 */
module.exports = function(params) {

    let { radius = 0, color = '#000000', border = 0 } = params;

    if (!radius) console.log('circle no raduis');

    let key = `${radius}-${color}-${border}`;

    if (!circlePool[key]) {
        // 离屏渲染
        let circleCanvas = new Canvas({
            name : 'circle',
            wh   : [radius, radius]
        });

        // circleCanvas.dom({
        //     position : [0, 0],
        //     size     : ['full', 'full'],
        //     bg       : 'rgba(255,0,0,0.1)',
        //     zoom     : -1
        // });

        circlePool[key] = circleCanvas.dom({
            bg       : color,
            name     : 'base-circle',
            position : [0, 0],
            size     : [radius, radius],
            radius   : radius,
            border,
            zoom     : 1
        });
    }

    return circlePool[key].ctx;
};
