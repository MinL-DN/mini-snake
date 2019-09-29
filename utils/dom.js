const { getGuid } = require('./index');
const screenWH = [window.innerWidth, window.innerHeight];

// dom 生成插件
module.exports = class Dom {

    constructor(params, ctx) {

        // if (scene.doms.find(v => v.domName == params.name)) {
        //     return console.log(params.name + ' 重名啦！');
        // }

        // 渲染离屏canvas
        params.img = params.subCanvasContent ? params.subCanvasContent.canvas : window.resources[params.img];

        if (params.img && !params.size) {
            params.size = params.subCanvasContent ? params.subCanvasContent.canvasInnerWH : [params.img.width, params.img.height];
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

        let size = this.computeOffset(params.size, ctx, 'size'); // 计算相对屏幕大小
        let position = this.computeOffset(params.position, ctx, 'position', size); // 相对位置计算

        Object.assign(
            this, { border: 0, radius: 0, text: '', textStyle: {}, fontSize: 0 }, params,
            {
                ctx, size, position,
                domId   : getGuid(),
                domName : params.name
            }
        );

        this.render();
    }

    render() {

        let ctx = this.ctx;

        // 超出屏幕不渲染
        if (
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

        if (this.isSnake) {
            ctx.beginPath();
            let gradient = ctx.createLinearGradient(0, 0, 70, 55);
            gradient.addColorStop(0, "red");
            gradient.addColorStop(1, "yellow");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.moveTo(20, 20);
            ctx.lineTo(30, 40);
            ctx.lineTo(50, 60);
            ctx.lineTo(70, 55);
            ctx.stroke();
        } else if (this.img) { // 图片渲染

            let img = this.img; // 规定要使用的图像、画布或视频。
            let sxy = [];
            let swh = [];
            let xy = [];

            if (this.imgType == 'fixed') {
                sxy = this.sxy || [0, 0];
                swh = screenWH;
                xy = [0, 0];
            } else {
                for (let index = 0; index < 2; index++) {
                    sxy[index] = this.position[index] <= 0 ? this.position[index] * -1 : 0; // 开始剪切的 xy 坐标位置。
                    swh[index] = this.position[index] >= 0 ? screenWH[index] - this.position[index] : this.size[index] + this.position[index]; // 被剪切图像的宽度。
                    xy[index] = this.position[index] > 0 ? this.position[index] : 0; // 在画布上放置图像的 xy 坐标位置

                    // wh[index]= this.size[index]; // 要使用的图像的宽度。（伸展或缩小图像） // 无需缩放，此处不需要

                    let diff = this.position[index] >= 0 ? this.size[index] : screenWH[index];
                    swh[index] = swh[index] > diff ? diff : swh[index];
                }
            }

            ctx.drawImage(img, ...sxy, ...swh, ...xy, ...swh);

        } else if (this.text || typeof this.bg == 'string') { // 文字以及纯色 bg 绘画
            if (this.bg) {

                ctx.strokeStyle = this.bg;
                ctx.fillStyle = this.bg;

                if (this.radius) {
                    this.drawRoundRect('bg', this.position[0], this.position[1], this.size[0], this.size[1], this.radius);
                } else {
                    ctx.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
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
    computeOffset(values = [], ctx, type = 'position', size = []) {

        let result = [];
        let canvasWH = ctx.canvasInnerWH;
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
