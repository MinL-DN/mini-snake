const Dom = require('../utils/dom');

module.exports = class Canvas {
    constructor(name, wh, _canvas) {

        _canvas = _canvas || wx.createCanvas();

        const ctx = _canvas.getContext('2d'); // 主 canvas

        if (wh) {
            ctx.canvas.width = wh[0];
            ctx.canvas.height = wh[1];
        }

        ctx.canvasInnerWH = [ctx.canvas.width, ctx.canvas.height];

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

    let width = ctx.canvas.width;
    let height = ctx.canvas.height;

    let pixel = wx.getSystemInfoSync().devicePixelRatio;

    if (pixel && pixel != 1) {
        // ctx.canvas.style.width = width + 'px';
        // ctx.canvas.style.height = height + 'px';
        ctx.canvas.width = width * pixel;
        ctx.canvas.height = height * pixel;
        ctx.scale(pixel, pixel);
    }
}
