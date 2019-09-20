
const Base = require('./index');
const Snake = require('../component/snake');
const Camera = require('../component/camera');

module.exports = class Main extends Base {

    constructor(ctx) {
        super(ctx);
        console.log('this main');
        this.runSecond = 0;
        this.snakes = [];
        this.buildDom(); // 实例化蛇等
        this.camera = new Camera(ctx); // 实例化摄像机
    }

    buildDom() {

        let self = this;

        // 背景图
        this.bgDom = this.dom({
            name     : 'bg',
            position : ['center', 'center'],
            img      : 'public/images/bg.jpg',
            zoom     : -1
        });

        // 根据背景图的大小决定游戏活动范围 // 碰撞边界
        this.limitArea = [
            [this.bgDom.position[0], this.bgDom.position[0] + this.bgDom.size[0]],
            [this.bgDom.position[1], this.bgDom.position[1] + this.bgDom.size[1]]
        ];

        for (let i = 0; i < 20; i++) {
            this.snakes.push(new Snake({
                scene   : this,
                isRobot : i !== 0
            }));
        }

        // 顶层遮罩
        this.mask = this.dom({
            name: 'mask',
            // // position     : [['left', 20], ['bottom', -20]],
            // // size         : [100, 100],
            // // radius       : 100,

            size     : this.ctx.test ? this.bgDom.size : ['full', 'full'],
            position : this.ctx.test ? this.bgDom.position : ['center', 'top'],

            bg           : 'rgba(0,0,0,0.1)',
            zoom         : 99999,
            onTouchStart : function(e) {
                this.moveOffset = e;
            },
            onTouchMove: function(e) {

                if (!this.moveOffset.touches.length) return;

                let x = e.touches[0].clientX - this.moveOffset.touches[0].clientX;
                let y = e.touches[0].clientY - this.moveOffset.touches[0].clientY;
                let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                let sin = x / z * self.snakes[0].speed;
                let cos = y / z * self.snakes[0].speed;

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

    // 每帧更新方法
    update() {

        this.snakes.map(v => v.autoMove());

        if (!this.ctx.test) {
            this.camera.move(this.snakes[0].moveSinCos, this.snakes[0].snakeBodys[0], this.bgDom);
            this.mask.position = this.camera.canvasOffset; // 背景图固定
        }

        this.canvasOffset = this.camera.canvasOffset; // 偏移量用作之后的时间定位计算

        // 每秒钟可以干的事情。。。
        let runSecond = parseInt(this.DOMHighResTimeStamp / 1000);
        if (runSecond > this.runSecond) {
            this.runSecond = runSecond;
            // console.log(this.runSecond);
            // if (runSecond > 10) self.snakeEVO();
        }
    }

    // 终止游戏
    stopGame() {
        // console.log('game end');
    }
};
