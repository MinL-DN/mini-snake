
const Base = require('./index');
const Snake = require('../component/snake');
const Camera = require('../component/camera');
const FoodCanvas = require('../component/food-canvas');

const { computerOffset } = require('../utils/index');

module.exports = class Main extends Base {

    constructor() {
        super();

        console.log('this main');
        this.runSecond = 0;
        this.snakes = [];
        this.buildDom(); // 实例化蛇等
        this.camera = new Camera(this.screenCanvas.ctx); // 实例化摄像机
        this.gameStatus = 2; // 1、待机 2、进行 3、游戏结束
    }

    buildDom() {

        let self = this;

        // 背景图
        this.bgDom = this.screenCanvas.dom({
            name     : 'bg',
            position : [0, 0],
            imgSrc   : 'public/images/bg.jpg',
            zoom     : -1
        });

        this.screenCanvas.ctx.bgWH = this.bgDom.size;

        // test
        if (!window.test) {
            let x = this.screenCanvas.ctx.bgWH[0] / 2 - this.screenCanvas.ctx.canvasInnerWH[0] / 2;
            let y = this.screenCanvas.ctx.bgWH[1] / 2 - this.screenCanvas.ctx.canvasInnerWH[1] / 2;
            this.screenCanvas.ctx.canvasOffset = [x, y];
            this.screenCanvas.ctx.translate(x * -1, y * -1);
        }

        // 食物层
        this.foodSubCanvasDom = this.screenCanvas.dom({
            name      : 'foodSubCanvas',
            size      : this.bgDom.size,
            position  : [0, 0],
            subCanvas : new FoodCanvas({ scene: this }),
            zoom      : 0
        });

        for (let i = 0; i < 1; i++) {

            let snake = new Snake({
                scene       : this,
                snakesIndex : i
            });

            this.snakes.push(snake);
        }

        // 顶层遮罩
        this.mask = this.screenCanvas.dom({
            name: 'mask',
            // // position     : [['left', 20], ['bottom', -20]],
            // // size         : [100, 100],
            // // radius       : 100,

            size     : ['full', 'full'],
            position : ['center', 'center'],

            bg           : 'rgba(0,0,0,0.1)',
            zoom         : 99999,
            onTouchStart : function(e) {
                this.moveOffset = e;
            },
            onTouchMove: function(e) {

                if (!this.moveOffset.touches.length) return;

                let { sin, cos } = computerOffset([e.touches[0].clientX, e.touches[0].clientY], [this.moveOffset.touches[0].clientX, this.moveOffset.touches[0].clientY]);

                if (sin) self.snakes[0].moveSinCos[0] = sin;
                if (cos) self.snakes[0].moveSinCos[1] = cos;

                this.moveOffset = e;
            },
            onTouchEnd: function(e) {
                e;
                this.moveOffset = { touches: [] };
            }
        });
    }

    // 根据背景图的大小决定游戏活动范围
    // 碰撞边界
    limitArea(radius) {

        if (radius === undefined) console.log('limitArea no raduis');

        return this.bgDom ? [
            [this.bgDom.position[0], this.bgDom.position[0] + this.bgDom.size[0] - radius],
            [this.bgDom.position[1], this.bgDom.position[1] + this.bgDom.size[1] - radius]
        ] : [[0, 0], [0, 0]];
    }

    // 生成随机点
    randomCoordinates(radius) {

        let limitArea = this.limitArea(radius);

        let x = Math.floor(Math.random() * (limitArea[0][1] - limitArea[0][0])) + limitArea[0][0];
        let y = Math.floor(Math.random() * (limitArea[1][1] - limitArea[1][0])) + limitArea[1][0];

        return [x, y];
    }

    // 每帧更新方法
    update() {

        // 每秒钟可以干的事情。。。
        let runSecond = parseInt(this.DOMHighResTimeStamp / 100);
        if (runSecond > this.runSecond) {
            this.runSecond = runSecond;
            // console.log(this.runSecond);
        }

        if (this.gameStatus !== 2) return;

        let player = this.snakes[0];

        // 玩家蛇撞墙停止游戏
        if (player.isHitWall) {
            return this.stopGame('撞墙啦！');
        }

        // 蛇自动移动
        for (let i = 0; i < this.snakes.length; i++) {
            const snake = this.snakes[i];
            snake.autoMove();
        }

        if (!window.test) {
            this.camera.move(player, this.limitArea(0));
        }
        this.mask.position = this.screenCanvas.ctx.canvasOffset; // 背景图固定
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
