// camera 类

const { getGuid } = require('../utils/index');

const WrapperMargin = 150;
const SCREEN = [window.innerWidth, window.innerHeight];

module.exports = class Camera {

    constructor(ctx) {
        console.log('create a camera');
        this.cameraId = getGuid();
        this.ctx = ctx;
        this.canvasOffset = [0, 0];
    }

    /**
     * 每帧更新方法
     *
     * @param {array} moveSinCos xy 偏移量
     * @param {Dom} moveTarget 移动 dom
     * @param {Dom} limitTarget 边框限制区域
     */
    move(moveSinCos, moveTarget, limitTarget) {

        // 横纵轴处理逻辑类似，此处用for循环处理，简化代码 0：X轴 1：Y轴
        for (let i = 0; i < 2; i++) {

            let cOffset       = this.canvasOffset[i];
            let tri           = moveSinCos[i];
            let dCanvasOffset = cOffset + tri;

            let snakeHeadPos  = moveTarget.position[i] + tri; // 蛇头坐标
            let bgMoveArea    = [cOffset + WrapperMargin, cOffset + SCREEN[i] - WrapperMargin - moveTarget.size[i]]; // 背景移动边界
            let bgLimit       = [(SCREEN[i] - limitTarget.size[i]) / 2 - WrapperMargin, (limitTarget.size[i] + SCREEN[i]) / 2 + WrapperMargin]; // 摄像头移动边界

            // 摄像头移动逻辑
            if (
                (snakeHeadPos < bgMoveArea[0] || snakeHeadPos > bgMoveArea[1]) && // 屏幕相对位移
                dCanvasOffset > bgLimit[0] && // 背景也不可出边框
                dCanvasOffset < bgLimit[1]
            ) {
                this.canvasOffset[i] = dCanvasOffset; // 记录 canvas 偏移量
                this.ctx.translate(...i == 0 ? [tri * -1, 0] : [0, tri * -1]); // 镜头反方向移动
            }
        }

        return this.canvasOffset;
    }
};
