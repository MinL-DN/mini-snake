
const { getGuid } = require('../utils/index');

// base
module.exports = class Base {

    constructor() {
        this.aniId = 0;
        this.sceneId = getGuid();
        this.screenCanvas = window.canvasPage[0];
        this.restart();
    }

    restart() {
        // 循环动画
        this.bindLoop = this.loop.bind(this);
        window.cancelAnimationFrame(this.aniId);
        window.requestAnimationFrame(this.bindLoop);
    }

    // loop
    loop(e) {

        let screenCanvas = this.screenCanvas;

        this.DOMHighResTimeStamp = e;

        screenCanvas.ctx.clearRect(...screenCanvas.ctx.canvasOffset || [0, 0], ...screenCanvas.ctx.canvasInnerWH); // 清除上一局的动画
        screenCanvas.doms.sort((a, b) => a.zoom - b.zoom > 0 ? 1 : -1).map(dom => dom.render()); // 计算dom动态

        typeof this.update == 'function' && this.update(); // 每帧更新动画

        this.aniId = window.requestAnimationFrame(this.bindLoop);
    }
};

// 触点触摸 触点移动 触摸结束 事件
const touchEvents = ['onTouchStart', 'onTouchMove', 'onTouchEnd'];

for (let i = 0; i < touchEvents.length; i++) {
    let touchEvent = touchEvents[i];
    wx[touchEvent](function(e) {
        let touch = e.touches.length ? e.touches : e.changedTouches;

        let ctx = window.canvasPage[0].ctx;
        let x = touch[0].clientX + (ctx.canvasOffset ? ctx.canvasOffset[0] : 0);
        let y = touch[0].clientY + (ctx.canvasOffset ? ctx.canvasOffset[1] : 0);

        for (let index in window.canvasPage[0].doms) {
            let dom = window.canvasPage[0].doms[index];
            // if (touchEvent == 'onTouchMove' && dom[touchEvent]) {
            //     'onTouchMove';
            //     touchEvent;
            // }
            if (
                typeof dom[touchEvent] == 'function' && dom.position &&
                x > dom.position[0] && x < dom.position[0] + dom.size[0] &&
                y > dom.position[1] && y < dom.position[1] + dom.size[1]
            ) {
                dom[touchEvent](e);
            }
        }
    });
}
