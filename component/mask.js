// 顶层遮罩，用来控制用户操作

const { computerOffset } = require('../utils/index');
const Canvas = require('../utils/canvas');

// 离屏渲染 顶层遮罩
module.exports = function(params) {

    // 离屏渲染
    const maskCanvas = new Canvas('mask');

    let maskDom = maskCanvas.dom({
        name         : 'mask',
        size         : ['full', 'full'],
        position     : ['center', 'center'],
        bg           : 'rgba(0,0,0,0.5)',
        zoom         : 1,
        onTouchStart : function(e) {
            this.moveOffset = e;
        },
        onTouchMove: function(e) {

            if (!this.moveOffset.touches.length) return;

            let { sin, cos } = computerOffset([e.touches[0].clientX, e.touches[0].clientY], [this.moveOffset.touches[0].clientX, this.moveOffset.touches[0].clientY]);

            // self.snakes[0].computeSnake([sin || 0, cos || 0]);

            console.log(sin, cos);

            this.moveOffset = e;
        },
        onTouchEnd: function(e) {
            e;
            this.moveOffset = { touches: [] };
        }
    });

    // handleEvent(maskDom);

    return maskDom.ctx;
};


// position     : [['left', 20], ['bottom', -20]],
// size         : [100, 100],
// radius       : 100,

