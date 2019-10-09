// snake 类

const GradientColor = require('../utils/gradientColor');
const { getGuid, computerOffset } = require('../utils/index');
const Circle = require('./circle');

const COLORS = ['#00fffa', '#009aff', '#005fff', '#1700ff', '#8c00ff', '#eb00ff', '#ff00aa', '#ff0092', '#00ffee', '#ff007a'];
const OFFSET = 15;

module.exports = class Snake {

    constructor(params) {

        console.log('create a snake');

        let baseRandom = parseInt(Math.random() * 10);
        let isRobot    = params.snakesIndex !== 0;

        Object.assign(this, {
            isRobot,
            snakeLen   : 10,
            speed      : 2,
            snakeId    : getGuid(),
            snakeBodys : [],
            trajectory : [],
            colors     : isRobot ? [COLORS[baseRandom], '#eee'] : ['#ff0000', '#ffff00']
        }, params);

        this.turnDir(); // 初始方向计算
        this.computeSnake(); // 其他属性计算（蛇宽、蛇身生成）
    }


    /**
     * 转向逻辑
     * @param {*} moveSinCos 偏移角度
     */
    turnDir(moveSinCos) {

        if (!moveSinCos) {
            let sin = Math.random() * randomPlusMinus();
            let cos = Math.sqrt(1 - Math.pow(sin, 2)) * randomPlusMinus();
            moveSinCos = [sin, cos];
        }

        this.moveSinCos = moveSinCos;

        // 随机正负
        function randomPlusMinus() {
            return Math.random() > 0.5 ? 1 : -1;
        }
    }

    /**
     * 计算蛇的各种属性
     * 根据 this.snakeLen 控制蛇长度
     *
     */
    computeSnake() {

        let self = this;

        // 根据 蛇长度差 进行操作
        let subtract = this.snakeLen - this.snakeBodys.length;
        if (subtract > 0) {
            // 根据蛇身渲染蛇
            for (let i = 0; i < subtract; i++) {
                let _l = this.snakeBodys.length + 1;
                // 根据蛇长算出蛇宽度
                this.radius = _l / 4 + 25;

                // 计算界限
                this.limitArea = [
                    [this.scene.limitArea[0][0], this.scene.limitArea[0][1] - this.radius],
                    [this.scene.limitArea[1][0], this.scene.limitArea[1][1] - this.radius]
                ];

                // 蛇身渐变色
                this.snakeColor = new GradientColor(...this.colors, _l);

                renderSnake();
            }
        }

        let prevSnake = this.scene.snakes[this.snakesIndex - 1];
        for (let i = 0; i < this.snakeBodys.length; i++) {

            let v = this.snakeBodys[i];
            let pre = this.snakeBodys[i - 1];

            // 根据蛇是否变长更新蛇属性
            let imgCtx = subtract > 0 ? new Circle({ radius: this.radius, color: this.snakeColor[i] }) : '';
            if (imgCtx) {
                v.img = imgCtx.canvas;
                v.size = JSON.parse(JSON.stringify(imgCtx.canvasInnerWH));
            }

            v.zoom = (prevSnake ? prevSnake.snakeBodys[0].zoom : 0) + this.snakeBodys.length - i;


            if (i == 1 && pre) {
                let dis = computerOffset(pre.position, v.position);
                dis.z;
            }

            let canStart = pre && !v.start ? computerOffset(pre.position, v.position).z >= OFFSET : false;
            if ((canStart || v.start) && i) {
                v.start = true;
                let prePos = this.trajectory.findIndex(_t => _t[0] == v.position[0] && _t[1] == v.position[1]);
                let thisPos = this.trajectory[prePos + 1];

                v.position = JSON.parse(JSON.stringify(thisPos));

                if (i == this.snakeBodys.length - 1 && prePos != -1) {
                    this.trajectory.shift();
                }
            }
        }

        // 生成蛇段实例
        function renderSnake() {

            let position = [0, 0];

            let prev = self.snakeBodys[self.snakeBodys.length - 1];

            if (prev) {
                position = JSON.parse(JSON.stringify(prev.position));
            } else {
                let x = Math.floor(Math.random() * (self.limitArea[0][1] - self.limitArea[0][0])) + self.limitArea[0][0];
                let y = Math.floor(Math.random() * (self.limitArea[1][1] - self.limitArea[1][0])) + self.limitArea[1][0];
                position = self.isRobot ? [x, y] : ['center', 'center'];
            }

            self.snakeBodys.push(self.scene.screenCanvas.dom({
                name: `snake-${self.snakeBodys.length.toString().padStart(5, 0)}-${self.snakeId}`,
                position
            }));
        }
    }

    // 每帧更新方法
    autoMove() {

        let self = this;
        let snakeHead = this.snakeBodys[0]; // this.snakeBodys[0] 是蛇头，其余是蛇身
        let dshp = []; // diff shake head poition
        let isHitWall = false; // 是否碰壁

        // 都是0 或者未开始时 停止移动
        if (this.moveSinCos[0] == 0 && this.moveSinCos[1] == 0) return;

        // 横纵轴处理逻辑类似，此处用for循环处理，简化代码 0：X轴 1：Y轴
        for (let i = 0; i < 2; i++) {
            dshp[i] = snakeHead.position[i] + this.moveSinCos[i] * this.speed; // 蛇头坐标
            if (dshp[i] <= this.limitArea[i][0] || dshp[i] >= this.limitArea[i][1]) { // 边界碰撞处理
                isHitWall = true;
            }
        }

        if (this.isRobot && (Math.random() * 100 < 1 && this.snakeBodys[this.snakeBodys.length - 1].start || isHitWall)) { // 机器蛇 随机转向 或者将要碰墙时自动调转方向
            return this.turnDir();
        } else if (isHitWall) { // 玩家蛇 撞墙弹框提示并且终止游戏
            this.isHitWall = isHitWall;
            return;
        }

        // 蛇头移动
        this.snakeBodys[0].position = dshp;
        this.trajectory.push(this.snakeBodys[0].position);
        this.computeSnake();

        //  // 蛇头碰撞逻辑
        //  // 与其他蛇碰撞
        //  for (let j = 0; j < this.scene.snakes.length; j++) {
        //      const snake = this.scene.snakes[j];
        //      if (snake.snakeId == this.snakeId) continue;
        //      let { z } = computerOffset(snake.snakeBodys[0].position, v.position);
        //      if (z <= v.radius) {
        //          if (!snake.isRobot) { // 玩家蛇碰撞
        //              console.log('hit');
        //          }
        //      }
        //  }
        //  // 与食物碰撞
        //  for (let j = 0; j < this.scene.foods.length; j++) {
        //      const food = this.scene.foods[j];
        //      let { z } = computerOffset(food.position, v.position);
        //      if (z < this.radius / 2) {
        //          food.beEaten();
        //          this.renderSnake(this.moveSinCos);
        //          // for (let index = 0; index < 5; index++) {
        //          //     this.renderSnake(this.moveSinCos);
        //          // }
        //      }
        //  }
    }
};
