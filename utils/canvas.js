const Dom = require('../utils/dom');

module.exports = class Canvas {


    /**
     *Creates an instance of Canvas.
     * @param {*} params
     * @param {*} params.name 画布名称
     * @param {*} params.wh 画布长宽
     * @param {*} params._canvas 自行填充的canvas
     * @param {*} params.isAnti 是否需要缩放
     */
    constructor(params) {

        let { name, wh, _canvas } = params;

        _canvas = _canvas || wx.createCanvas();

        const ctx = _canvas.getContext('2d'); // 主 canvas

        if (wh) { // canvas 宽高不可以是小数。。。
            ctx.canvas.width = Math.ceil(wh[0]);
            ctx.canvas.height = Math.ceil(wh[1]);
        }

        ctx.canvasInnerWH = wh || [ctx.canvas.width, ctx.canvas.height];

        // canvas 抗锯齿
        antiAliasing(ctx);

        // test
        if (name == 'screen' && window.test) ctx.scale(1 / 6, 1 / 6);

        this.canvasName = name || '';
        this.doms = [];
        this.ctx = ctx;

        if (!window.canvasPage) window.canvasPage = [];

        window.canvasPage.push(this);
    }

    dom(params) {
        let _dom = new Dom(params, this.ctx);
        this.doms.push(_dom);
        return _dom;
    }
};

function antiAliasing(ctx) {

    let wh = [ctx.canvas.width, ctx.canvas.height];

    let devicePixelRatio = wx.getSystemInfoSync().devicePixelRatio || 1;
    let backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;

    let pixel = devicePixelRatio / backingStoreRatio;

    pixel = [pixel, pixel];

    for (let i = 0; i < 2; i++) { // 0、x 1、y
        let key = i === 0 ? 'width' : 'height';
        ctx.canvas.style[key] = wh[i] + 'px';
        ctx.canvas[key] = ctx.canvas[key] * pixel[i];

        // canvas存在最大宽高，需要以此来做缩放 ios 微信 4096
        let up = Math.ceil(ctx.canvasInnerWH[i]);
        if (ctx.canvas[key] != up * pixel[i]) {
            pixel[i] = ctx.canvas[key] / up;
        }
    }

    ctx.scale(...pixel);
}
