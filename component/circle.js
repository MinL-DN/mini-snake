
const Canvas = require('../utils/canvas');

// 离屏渲染基础圆
module.exports = function(params) {

    // 离屏渲染
    const circleCanvas = new Canvas('circle', [params.radius, params.radius]);

    let circle = circleCanvas.dom({
        bg       : params.color,
        name     : `snake-base-circle`,
        position : ['center', 'center'],
        size     : [params.radius, params.radius],
        radius   : params.radius,
        zoom     : 1
    });

    return circle;
};
