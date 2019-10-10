// camera 类

const { getGuid } = require('../utils/index');

const WrapperMargin = 150;
const SCREEN = [window.innerWidth, window.innerHeight];

module.exports = class Camera {

    constructor(ctx) {
        console.log('create a camera');
        this.cameraId = getGuid();
        this.ctx = ctx;
        this.ctx.canvasOffset = this.ctx.canvasOffset || [0, 0];
    }

    /**
     * 每帧更新方法
     *
     * @param {Dom} player 玩家
     * @param {Dom} limitArea 边框限制区域
     */
    move(player, limitArea) {

        // 横纵轴处理逻辑类似，此处用for循环处理，简化代码 0：X轴 1：Y轴
        for (let i = 0; i < 2; i++) {

            let cOffset       = this.ctx.canvasOffset[i];
            let tri           = player.moveSinCos[i] * player.speed;
            let dCanvasOffset = cOffset + tri;

            let snakeHeadPos  = player.snakeBodys[0].position[i] + tri; // 蛇头坐标
            let bgMoveArea    = [cOffset + WrapperMargin, cOffset + SCREEN[i] - WrapperMargin - player.snakeBodys[0].size[i]]; // 背景移动边界
            let bgLimit       = [limitArea[i][0] - WrapperMargin, limitArea[i][1] + SCREEN[i] + WrapperMargin]; // 摄像头移动边界

            // 摄像头移动逻辑
            if (
                (snakeHeadPos < bgMoveArea[0] || snakeHeadPos > bgMoveArea[1]) && // 屏幕相对位移
                dCanvasOffset > bgLimit[0] && // 背景也不可出边框
                dCanvasOffset < bgLimit[1]
            ) {
                this.ctx.canvasOffset[i] = dCanvasOffset; // 记录 canvas 偏移量
                this.ctx.translate(...i == 0 ? [tri * -1, 0] : [0, tri * -1]); // 镜头反方向移动
            }
        }
    }
};
