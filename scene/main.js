
const Base = require('./base');
const { computerOffset } = require('../utils/index');

// const Snake  = require('../component/snake');
const SnakeCanvas = require('../component/snake-canvas');
const Food        = require('../component/food');
const mask        = require('../component/mask');

module.exports = class Main extends Base {

    constructor() {

        super('main');

        console.log('this main');
        this.buildDom(); // 实例化蛇等
        this.gameStatus = 1; // 1、待机 2、进行 3、游戏结束

        // this.foods = [];
        // this.runSecond = 0;
    }

    buildDom() {

        let self = this;

        // 背景图
        this.bgDom = this.canvas.dom({
            name     : 'bg',
            position : ['center', 'center'],
            img      : 'public/images/bg.jpg',
            zoom     : -1
        });

        // 根据背景图的大小决定游戏活动范围、碰撞边界
        this.limitArea = [
            [this.bgDom.position[0], this.bgDom.position[0] + this.bgDom.size[0]],
            [this.bgDom.position[1], this.bgDom.position[1] + this.bgDom.size[1]]
        ];

        // 蛇的画布
        this.snakeCanvas = new SnakeCanvas({
            snakeNum        : 1,
            screenLimitArea : this.limitArea
        });

        // 将蛇画布贴进主画布背景
        this.snakeCanvasDom = this.canvas.dom({
            imgType          : 'fixed',
            name             : 'snakeCanvas',
            position         : ['center', 'center'],
            size             : ['full', 'full'],
            subCanvasContent : this.snakeCanvas.ctx,
            zoom             : 1
        });

        // for (let index = 0; index < 5; index++) {
        //     this.foods.push(new Food({ scene: this }));
        // }

        // // 顶层遮罩
        // this.mask = this.dom({
        //     name             : 'mask',
        //     position         : ['center', 'center'],
        //     size             : ['full', 'full'],
        //     subCanvasContent : mask(),
        //     zoom             : 10
        // });
        // let maskDom = this.canvas.dom({
        //     name         : 'mask',
        //     size         : ['full', 'full'],
        //     position     : ['center', 'center'],
        //     bg           : 'rgba(0,0,0,0.5)',
        //     zoom         : 1,
        //     onTouchStart : function(e) {
        //         this.moveOffset = e;
        //     },
        //     onTouchMove: function(e) {

        //         if (!this.moveOffset.touches.length) return;

        //         // let { sin, cos } = computerOffset([e.touches[0].clientX, e.touches[0].clientY], [this.moveOffset.touches[0].clientX, this.moveOffset.touches[0].clientY]);

        //         // self.bgDom.position[0] += sin;
        //         // self.bgDom.position[1] += cos;

        //         // console.log(sin, cos);

        //         this.moveOffset = e;
        //     },
        //     onTouchEnd: function(e) {
        //         e;
        //         this.moveOffset = { touches: [] };
        //     }
        // });

        // // handleEvent(maskDom);

        // return maskDom.ctx;
    }

    // 每帧更新方法
    update() {

        // this.bgDom.position[0] -= 10;
        // this.bgDom.position[1] -= 10;

        // 蛇自动移动
        this.snakeCanvas.reRender(this.bgDom);

        // 蛇 canvas 位移
        this.snakeCanvasDom.sxy = [
            this.snakeCanvas.camera.canvasOffset[0],
            this.snakeCanvas.camera.canvasOffset[1]
        ];

        // // 每 100毫秒 计时器
        // let runSecond = parseInt(this.DOMHighResTimeStamp / 100);
        // if (runSecond > this.runSecond) {
        //     this.runSecond = runSecond;
        //     // console.log(this.runSecond);
        //     // if (runSecond > 10) self.snakeEVO();
        // }

        // if (this.gameStatus !== 2) return;

        // let player = this.snakes[0];

        // // 玩家蛇撞墙停止游戏
        // if (player.isHitWall) {
        //     return this.stopGame('撞墙啦！');
        // }
    }

    // 终止游戏
    stopGame(str = '游戏结束！') {
        this.gameStatus = 3;
        wx.showToast({
            title    : str,
            icon     : 'success',
            duration : 2000
        });
    }
};
