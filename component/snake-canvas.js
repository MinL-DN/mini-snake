
// 顶层遮罩，用来控制用户操作
const Canvas = require('../utils/canvas');
const Snake = require('./snake');
const Camera = require('./camera');


// 离屏渲染 蛇canvas
module.exports = class SnakeCanvas extends Canvas {

    constructor(params) {

        super('snake');

        this.snakes = [];

        this.camera = new Camera(); // 实例化跟踪蛇摄像机

        this.screenLimitArea = params.screenLimitArea;

        for (let i = 0; i < params.snakeNum; i++) {
            let snake = new Snake({
                isRobot     : i !== 0,
                snakesIndex : i,
                snakeCanvas : this
            });
            this.snakes.push(snake);
        }
    }

    reRender() {

        let player = this.snakes[0];

        this.snakes.map(v => v.autoMove());

        if (!window.test && player.snakeBodys[0]) {
            this.camera.move(player.snakeBodys[0], this.screenLimitArea);
            // this.mask.position = this.ctx.canvasOffset; // 背景图固定
            this.camera.canvasOffset;

            if (this.camera.canvasOffset[0]) {
                this.camera.canvasOffset;
            }
        }
    }
};
