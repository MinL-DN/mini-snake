
const Base = require('./index');
const Snake = require('../component/snake');
const Camera = require('../component/camera');
const Food = require('../component/food');
const Circle = require('../component/circle');

const { computerOffset } = require('../utils/index');


module.exports = class Main extends Base {

    constructor() {
        super();
        console.log('this main');
        this.runSecond = 0;
        this.snakes = [];
        this.foods = [];
        this.buildDom(); // 实例化蛇等
        this.camera = new Camera(this.screenCanvas.ctx); // 实例化摄像机
        this.gameStatus = 2; // 1、待机 2、进行 3、游戏结束
    }

    buildDom() {

        let self = this;

        // 背景图
        this.bgDom = this.screenCanvas.dom({
            name     : 'bg',
            position : ['center', 'center'],
            imgSrc   : 'public/images/bg.jpg',
            zoom     : -1
        });

        // let circleCtx = new Circle({ radius: 40, color: 'red' });

        // this.screenCanvas.dom({
        //     name     : 'aaa',
        //     position : [0, 0],
        //     img      : circleCtx.canvas,
        //     zoom     : 0
        // });

        this.screenCanvas.dom({
            name     : 'bbb',
            position : [40, 0],
            radius   : 50,
            size     : [50, 50],
            bg       : 'yellow',
            zoom     : 1
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

            size     : this.bgDom.size,
            position : this.bgDom.position,

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

        // test
        if (window.test) this.screenCanvas.ctx.translate(900, 800); // 镜头反方向移动
    }

    // 根据背景图的大小决定游戏活动范围
    // 碰撞边界
    limitArea(radius) {
        return this.bgDom ? [
            [this.bgDom.position[0], this.bgDom.position[0] + this.bgDom.size[0] - radius],
            [this.bgDom.position[1], this.bgDom.position[1] + this.bgDom.size[1] - radius]
        ] : [[0, 0], [0, 0]];
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

        this.camera.move(player, this.bgDom);
        this.mask.position = this.screenCanvas.ctx.canvasOffset; // 背景图固定
    }

    // 终止游戏
    stopGame(str = '游戏结束！') {
        // this.gameStatus = 3;
        wx.showToast({
            title    : str,
            icon     : 'success',
            duration : 2000
        });
    }
};
