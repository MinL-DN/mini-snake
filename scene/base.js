
const Canvas = require('../utils/canvas');

// 主canvas
const screenCanvas = new Canvas('screen', '', canvas);

// base
module.exports = class Base {

    constructor(canvasName) {
        // 副canvas
        this.canvas = screenCanvas;
        // this.canvas = new Canvas(canvasName);
        this.aniId = 0;
        this.restart();
    }

    restart() {
        // 循环动画
        this.aniStartTime = Date.now();
        this.bindLoop = this.loop.bind(this);
        window.cancelAnimationFrame(this.aniId);
        this.aniId = window.requestAnimationFrame(this.bindLoop);
    }

    // loop
    loop(e) {

        // if (this.bindLoop) return;

        this.DOMHighResTimeStamp = e;

        let mainCtx = screenCanvas.ctx;

        // // 清除上一局的动画
        // mainCtx.clearRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);

        // 每帧更新动画
        typeof this.update == 'function' && this.update();

        // 计算dom动态
        window.canvasPage.map(v => {
            v.ctx.clearRect(0, 0, v.ctx.canvas.width, v.ctx.canvas.height);
            v.doms.map(dom => dom.render());
        });

        // // 将注册的 副canvas 剪切 主canvas 的 screenCtx
        // mainCtx.drawImage(
        //     this.canvas.ctx.canvas,
        //     0, 0, mainCtx.canvas.width, mainCtx.canvas.height,
        //     0, 0, mainCtx.canvasInnerWH[0], mainCtx.canvasInnerWH[1]
        // );

        this.aniId = window.requestAnimationFrame(this.bindLoop);
    }
};
