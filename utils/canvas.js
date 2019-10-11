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

        let { name, wh, _canvas, isAnti = true } = params;

        _canvas = _canvas || wx.createCanvas();

        const ctx = _canvas.getContext('2d'); // 主 canvas

        if (wh) { // canvas 宽高不可以是小数。。。
            ctx.canvas.width = Math.ceil(wh[0]);
            ctx.canvas.height = Math.ceil(wh[1]);
        }

        ctx.canvasInnerWH = wh || [ctx.canvas.width, ctx.canvas.height];

        // canvas 抗锯齿
        if (isAnti) antiAliasing(ctx);

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

    let width = ctx.canvas.width;
    let height = ctx.canvas.height;

    let devicePixelRatio = wx.getSystemInfoSync().devicePixelRatio || 1;
    let backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    let pixel = devicePixelRatio / backingStoreRatio;
    // let pixel = 2; // 最大支持canvas宽度4096。。。你敢信？？？

    if (pixel && pixel != 1) {
        ctx.canvas.style.width = width + 'px';
        ctx.canvas.style.height = height + 'px';
        ctx.canvas.width = width * pixel;
        ctx.canvas.height = height * pixel;
        ctx.scale(pixel, pixel);
    }
}
