
const Canvas = require('../utils/canvas');

/**
 * 离屏渲染基础圆
 *
 * @param {*} params
 * @param {*} params.radius
 * @param {*} params.color
 * @returns
 */
module.exports = function(params) {

    let { radius, color, border } = params;

    if (!radius) console.log('circle no raduis');

    // 离屏渲染
    const circleCanvas = new Canvas('circle', [radius, radius]);

    let circle = circleCanvas.dom({
        bg       : color,
        name     : 'base-circle',
        position : ['center', 'center'],
        size     : [radius, radius],
        radius   : radius,
        border,
        zoom     : 1
    });

    return circle.ctx;
};
