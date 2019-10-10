const { getGuid } = require('./index');

// dom 生成插件
module.exports = class Dom {

    constructor(params, ctx) {

        // 渲染img
        params.img = params.subCtx ? params.subCtx.canvas : params.img || window.resources[params.imgSrc];
        if (!params.size) {
            params.size = params.subCtx ? params.subCtx.canvasInnerWH : params.img ? [params.img.width, params.img.height] : undefined;
        }

        if (params.text) {
            params.textStyle = Object.assign({
                color : '#ccc',
                font  : '12px sans-serif',
                align : 'left'
            }, params.textStyle);

            ctx.font = params.textStyle.font;
            params.fontSize = Number((ctx.font.match(/(\d+)px/) || [0, 0])[1]);
            params.size = [(ctx.measureText(params.text) || { width: 0 }).width, params.fontSize];
        }

        let size = this.computeOffset(ctx, params.size, 'size'); // 计算相对屏幕大小
        let position = this.computeOffset(ctx, params.position, 'position', size); // 相对位置计算

        Object.assign(
            this,
            { border: 0, borderColor: '#000', radius: 0, text: '', textStyle: {}, fontSize: 0 },
            params,
            {
                ctx, size, position,
                domId: getGuid()
            }
        );

        this.render();
    }

    render() {

        let ctx = this.ctx;

        // 超出屏幕不渲染
        if (
            !window.test &&
            ctx.canvasOffset && this.size[0] < ctx.canvasInnerWH[0] && this.size[1] < ctx.canvasInnerWH[1] &&
            (
                this.position[0] + this.size[0] < ctx.canvasOffset[0] ||
                this.position[1] + this.size[0] < ctx.canvasOffset[1] ||
                this.position[0] - this.size[0] > ctx.canvasOffset[0] + ctx.canvasInnerWH[0] ||
                this.position[1] - this.size[1] > ctx.canvasOffset[1] + ctx.canvasInnerWH[1]
            )
        ) {
            return;
        }

        ctx.save();

        // 图片渲染
        if (this.img) {
            ctx.drawImage(this.img, this.position[0], this.position[1], this.size[0], this.size[1]);
        } else if (this.text || typeof this.bg == 'string') { // 文字以及纯色 bg 绘画

            if (this.bg) {

                ctx.fillStyle = this.bg;

                if (this.radius) {
                    this.drawRoundRect('bg', this.position[0], this.position[1], this.size[0], this.size[1], this.radius);
                } else {
                    ctx.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
                }

                if (this.border) {
                    ctx.lineWidth = this.border;
                    ctx.strokeStyle = this.borderColor;
                    this.drawRoundRect('border', this.position[0] + this.border / 2, this.position[1] + this.border / 2, this.size[0] - this.border, this.size[1] - this.border, this.radius - this.border);
                }
            }
            if (this.text) {
                ctx.fillStyle = this.textStyle.color;
                ctx.textBaseline = 'middle';
                ctx.font = this.textStyle.font;
                ctx.fillText(this.text, this.position[0], this.position[1] + this.fontSize / 2 + 2);
            }
        }

        ctx.restore();
    }

    // 计算相对屏幕的大小或者位置
    computeOffset(ctx, values = [], type = 'position', size = []) {

        let canvasWH = ctx.canvasInnerWH;

        let result = [];

        for (let i = 0; i < 2; i++) {

            let value = values[i] || 0;
            let offset = 0; // 偏移量

            if (Array.isArray(value)) {
                offset = value[1];
                value = value[0];
            }

            if (type == 'position') {
                if (value == 'center') {
                    value = (canvasWH[i] - size[i]) / 2 + offset;
                } else if (value == 'left' && i == 0 || value == 'top' && i == 1) {
                    value = 0 + offset;
                } else if (value == 'right' && i == 0 || value == 'bottom' && i == 1) {
                    value = canvasWH[i] - size[i] + offset;
                }
            } else {
                if (value == 'full') {
                    value = canvasWH[i] + offset;
                }
            }

            result[i] = isNaN(value) ? 0 : value;
        }

        return result;
    }

    /**
     * 圆角类
     * type bg、绘制矩形 border、边框
     */
    drawRoundRect(type, x, y, w, h, r) {

        let ctx = this.ctx;
        let radius = r || 0;
        if (radius > (w > h ? h : w) / 2) radius = h / 2;

        ctx.save();

        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
        ctx.lineTo(w - radius + x, y);
        ctx.arc(w - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
        ctx.lineTo(w + x, h + y - radius);
        ctx.arc(w - radius + x, h - radius + y, radius, 0, Math.PI * 1 / 2);
        ctx.lineTo(radius + x, h + y);
        ctx.arc(radius + x, h - radius + y, radius, Math.PI * 1 / 2, Math.PI);
        ctx.lineTo(x, y + radius);
        ctx.closePath();

        if (type == 'border') {
            ctx.stroke();
        } else if (type == 'bg') {
            ctx.fill();
        }

        ctx.restore();
    }
};
