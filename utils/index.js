
module.exports = {
    regeneratorRuntime : require('./libs/runtime'),
    getGuid            : function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    },
    antiAliasing(ctx) {

        let width = ctx.canvas.width;
        let height = ctx.canvas.height;
        ctx.canvasInnerWH = [width, height];

        if (window.devicePixelRatio) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            if (ctx.test) {
                ctx.scale(1 / 6, 1 / 6);
                ctx.translate(1000, 1000);
            } else {
                canvas.width = width * window.devicePixelRatio;
                canvas.height = height * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        }
    }
};
