// camera 类

const { getGuid } = require('../utils/index');

const WrapperMargin = 150;
const SCREEN = [window.innerWidth, window.innerHeight];

module.exports = class Camera {

    constructor() {
        console.log('create a camera');
        this.cameraId = getGuid();
        this.canvasOffset = [0, 0];
    }

    /**
     * 每帧更新方法
     *
     * @param {Dom} moveTarget 移动 dom
     * @param {Dom} 边框限制区域
     */
    move(moveTarget, limitArea) {

        // 横纵轴处理逻辑类似，此处用for循环处理，简化代码 0：X轴 1：Y轴
        for (let i = 0; i < 2; i++) {

            let cOffset       = this.canvasOffset[i];
            let tri           = moveTarget.moveSinCos[i];
            let dCanvasOffset = cOffset + tri;

            let snakeHeadPos  = moveTarget.position[i] + tri; // 蛇头坐标
            let bgMoveArea    = [cOffset + WrapperMargin, cOffset + SCREEN[i] - WrapperMargin - moveTarget.size[i]]; // 背景移动边界
            let _limitArea = [limitArea[i][0] - WrapperMargin, limitArea[i][1] + WrapperMargin];

            // 摄像头移动逻辑
            if (
                (snakeHeadPos < bgMoveArea[0] || snakeHeadPos > bgMoveArea[1]) && // 屏幕相对位移
                dCanvasOffset > _limitArea[0] && // 背景也不可出边框
                dCanvasOffset < _limitArea[1]
            ) {
                this.canvasOffset[i] = dCanvasOffset; // 记录 主canvas 偏移量
                // this.ctx.translate(...i == 0 ? [tri * -1, 0] : [0, tri * -1]); // 镜头反方向移动
            }
        }
    }
};
