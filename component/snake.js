// snake 类

const GradientColor = require('../utils/gradientColor');
const { getGuid } = require('../utils/index');

const COLORS = ['#f4ff00', '#00ff0f', '#00ffe2', '#006bff', '#3a00ff', '#bb00ff', '#ff00e5', '#ff0092', '#ff0063', '#ff0040'];

module.exports = class Snake {

    constructor(params) {

        console.log('create a snake');

        let baseRandom = parseInt(Math.random() * 10);
        let snakeLen   = params.snakeLen || 20 + baseRandom;

        Object.assign(this, {
            speed      : 2 + baseRandom * 0.05,
            snakeId    : getGuid(),
            snakeBodys : [],
            colors     : params.isRobot ? [COLORS[baseRandom], '#eee'] : ['#ff0000', '#ffff00']
        }, params);

        this.computeSnake(this.moveSinCos);

        // 根据蛇身渲染蛇
        for (let i = 0; i < snakeLen; i++) {
            this.renderSnake(i);
        }
    }

    /**
     * 生成蛇段实例
     * 需要蛇增长也调用此方法
     *
     * @param {*} index  index = 0是蛇头，其余是蛇身
     */
    renderSnake(index) {

        let position = [0, 0];

        let prev = this.snakeBodys[this.snakeBodys.length - 1];

        if (prev) {
            position = [prev.position[0], prev.position[1]];
        } else {
            let x = Math.floor(Math.random() * (this.limitArea[0][1] - this.limitArea[0][0])) + this.limitArea[0][0];
            let y = Math.floor(Math.random() * (this.limitArea[1][1] - this.limitArea[1][0])) + this.limitArea[1][0];
            position = this.isRobot ? [x, y] : ['center', 'center'];
        }

        let _snake = this.scene.dom({
            name: `snake-${index.toString().padStart(5, 0)}-${this.snakeId}`,
            position
        });

        this.snakeBodys.push(_snake);

        this.computeSnake();
    }

    // 计算蛇的各种属性
    computeSnake() {

        let self = this;

        let snakeL = this.snakeBodys.length;

        // 蛇偏移量计算
        let offsetX = Math.random() * this.speed * randomPlusMinus();
        let offsetY = Math.sqrt(Math.pow(this.speed, 2) - Math.pow(offsetX, 2)) * randomPlusMinus();
        this.moveSinCos = [offsetX, offsetY];

        // 计算蛇长
        this.radius = snakeL / 4 + 25; // 根据蛇长算出蛇宽度

        // 计算界限
        this.limitArea = [
            [this.scene.limitArea[0][0], this.scene.limitArea[0][1] - this.radius],
            [this.scene.limitArea[1][0], this.scene.limitArea[1][1] - this.radius]
        ];

        let snakeColor = new GradientColor(...this.colors, snakeL); // 蛇身渐变色

        this.snakeBodys.forEach((v, i) => {
            v.bg = snakeColor[i];
            v.zoom = snakeL - i;
            v.size = [self.radius, self.radius];
            v.radius = self.radius;
        });

        function randomPlusMinus() {
            return Math.random() > 0.5 ? 1 : -1;
        }
    }

    // 每帧更新方法
    autoMove() {

        const OFFSET = 0.5;

        let self = this;
        let snakeHead = self.snakeBodys[0];

        if (self.moveSinCos[0] == 0 && self.moveSinCos[1] == 0) return;

        // 机器蛇随机乱动
        if (self.isRobot && Math.random() * 100 < 5) self.computeSnake();

        // 横纵轴处理逻辑类似，此处用for循环处理，简化代码 0：X轴 1：Y轴
        for (let i = 0; i < 2; i++) {

            let snakeHeadPos = snakeHead.position[i] + self.moveSinCos[i]; // 蛇头坐标

            if (snakeHeadPos <= self.limitArea[i][0] || snakeHeadPos >= self.limitArea[i][1]) { // 边界碰撞处理

                if (self.isRobot) { // 机器人将要碰墙时回头
                    self.computeSnake();
                } else {
                    self.moveSinCos = [0, 0];
                }

                return;
            }

            // 蛇头赋值
            snakeHead.position[i] = snakeHeadPos;
        }

        // 蛇身移逻辑
        self.snakeBodys.reduce((_prev, v, i) => {

            let _pos = v.position;
            let xy = [];

            for (let j = 0; j < 2; j++) {
                xy[j] = _prev[j] - self.moveSinCos[j] * OFFSET;
                // 蛇身也不要超过范围
                if (xy[j] < self.limitArea[j][0]) xy[j] = self.limitArea[j][0];
                if (xy[j] > self.limitArea[j][1]) xy[j] = self.limitArea[j][1];
            }

            if (i) v.position = xy;

            return _pos;

        }, snakeHead.position);
    }
};
