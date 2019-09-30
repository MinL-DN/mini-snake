// snake 类

const GradientColor = require('../utils/gradientColor');
const { getGuid } = require('../utils/index');

const COLORS = ['#00fffa', '#009aff', '#005fff', '#1700ff', '#8c00ff', '#eb00ff', '#ff00aa', '#ff0092', '#00ffee', '#ff007a'];
const OFFSET = 1;

module.exports = class Snake {

    constructor(params) {

        console.log('create a snake');

        let baseRandom = parseInt(Math.random() * 10);
        let snakeLen   = params.snakeLen || 20;

        Object.assign(this, {
            speed      : 2,
            snakeId    : getGuid(),
            snakeBodys : [],
            colors     : params.isRobot ? [COLORS[baseRandom], '#eee'] : ['#ff0000', '#ffff00']
        }, params);

        this.computeSnake(this.moveSinCos);

        this.trajectory = [];

        // 根据蛇身渲染蛇
        for (let i = 0; i < 20; i++) {
            this.renderSnake();
        }
    }

    /**
     * 生成蛇段实例
     * 需要蛇增长也调用此方法
     *
     * @param {*} this.snakeBodys[0] 是蛇头，其余是蛇身
     */
    renderSnake(moveSinCos) {

        let position = [0, 0];

        let prev = this.snakeBodys[this.snakeBodys.length - 1];

        if (prev) {
            position = [prev.position[0], prev.position[1]];
        } else {
            let x = Math.floor(Math.random() * (this.limitArea[0][1] - this.limitArea[0][0])) + this.limitArea[0][0];
            let y = Math.floor(Math.random() * (this.limitArea[1][1] - this.limitArea[1][0])) + this.limitArea[1][0];
            position = this.isRobot ? [x, y] : ['center', 'center'];
        }

        this.snakeBodys.push(this.scene.dom({
            name: `snake-${this.snakeBodys.length.toString().padStart(5, 0)}-${this.snakeId}`,
            position
        }));

        this.computeSnake(moveSinCos);
    }

    // 计算蛇的各种属性
    computeSnake(moveSinCos) {

        let self = this;

        let snakeL = this.snakeBodys.length;

        // 蛇偏移量计算
        let offsetX = Math.random() * this.speed * randomPlusMinus();
        let offsetY = Math.sqrt(Math.pow(this.speed, 2) - Math.pow(offsetX, 2)) * randomPlusMinus();
        this.moveSinCos = moveSinCos || [offsetX, offsetY];

        // 计算蛇长
        this.radius = snakeL / 4 + 25; // 根据蛇长算出蛇宽度

        // 计算界限
        this.limitArea = [
            [this.scene.limitArea[0][0], this.scene.limitArea[0][1] - this.radius],
            [this.scene.limitArea[1][0], this.scene.limitArea[1][1] - this.radius]
        ];

        let snakeColor = new GradientColor(...this.colors, snakeL); // 蛇身渐变色
        let prevSnake =  this.scene.snakes[this.snakesIndex - 1];

        this.snakeBodys.forEach((v, i) => {
            v.bg = snakeColor[i];
            v.zoom = (prevSnake ? prevSnake.snakeBodys[0].zoom : 0) + snakeL - i;
            v.size = [self.radius, self.radius];
            v.radius = self.radius;

            if (this.trajectory[i] && i != 0) {
                v.position = JSON.parse(JSON.stringify(this.trajectory[i]));
            }
        });

        function randomPlusMinus() {
            return Math.random() > 0.5 ? 1 : -1;
        }
    }

    // 每帧更新方法
    autoMove(timeFlag) {

        let self = this;
        let snakeHead = self.snakeBodys[0];
        let dshp = []; // diff shake head poition
        let isHitWall = false; // 是否碰壁

        // 都是0的时候就停止移动
        if (self.moveSinCos[0] == 0 && self.moveSinCos[1] == 0) return;

        // 横纵轴处理逻辑类似，此处用for循环处理，简化代码 0：X轴 1：Y轴
        for (let i = 0; i < 2; i++) {
            dshp[i] = snakeHead.position[i] + self.moveSinCos[i] * OFFSET; // 蛇头坐标
            if (dshp[i] <= self.limitArea[i][0] || dshp[i] >= self.limitArea[i][1]) { // 边界碰撞处理
                isHitWall = true;
            }
        }

        if (self.isRobot && (Math.random() * 100 < 5 || isHitWall)) { // 机器蛇 随机转向 或者将要碰墙时自动调转方向
            return self.computeSnake();
        } else if (isHitWall) { // 玩家蛇 撞墙弹框提示并且终止游戏
            self.isHitWall = isHitWall;
            return;
        }

        // 蛇移动（可以想象为蛇尾替换到蛇头的位置）
        // let tail = self.snakeBodys.pop();
        // tail.position = dshp;
        // tail.zoom = snakeHead.zoom;
        // self.snakeBodys.unshift(tail);
        self.snakeBodys[0].position = dshp;
        self.computeSnake(self.moveSinCos);

        if (timeFlag) {

            console.log(timeFlag);

            this.trajectory.unshift(self.snakeBodys[0].position);

            if (this.trajectory.length > 100) this.trajectory.pop();
        }

        // if (!i) { // 蛇头碰撞逻辑

        //     // 与其他蛇碰撞
        //     for (let j = 0; j < self.scene.snakes.length; j++) {
        //         const snake = self.scene.snakes[j];

        //         if (snake.snakeId == self.snakeId) continue;

        //         let { z } = computerOffset(snake.snakeBodys[0].position, v.position);

        //         if (z <= v.radius) {
        //             if (!snake.isRobot) { // 玩家蛇碰撞
        //                 console.log('hit');
        //             }
        //         }
        //     }

        //     // 与食物碰撞
        //     for (let j = 0; j < self.scene.foods.length; j++) {
        //         const food = self.scene.foods[j];
        //         let { z } = computerOffset(food.position, v.position);
        //         if (z < self.radius / 2) {
        //             food.beEaten();
        //             self.renderSnake(self.moveSinCos);

        //             // for (let index = 0; index < 5; index++) {
        //             //     self.renderSnake(self.moveSinCos);
        //             // }
        //         }
        //     }

        // }

        // // 蛇头赋值
        // snakeHead.position = dshp;

        // let prevPos = dshp;

        // // 遍历蛇身
        // for (let i = 0; i < self.snakeBodys.length; i++) {

        //     const v = self.snakeBodys[i];

        //     if (!i) { // 蛇头碰撞逻辑

        //         // 与其他蛇碰撞
        //         for (let j = 0; j < self.scene.snakes.length; j++) {
        //             const snake = self.scene.snakes[j];

        //             if (snake.snakeId == self.snakeId) continue;

        //             let { z } = computerOffset(snake.snakeBodys[0].position, v.position);

        //             if (z <= v.radius) {
        //                 if (!snake.isRobot) { // 玩家蛇碰撞
        //                     console.log('hit');
        //                 }
        //             }
        //         }

        //         // 与食物碰撞
        //         for (let j = 0; j < self.scene.foods.length; j++) {
        //             const food = self.scene.foods[j];
        //             let { z } = computerOffset(food.position, v.position);
        //             if (z < self.radius / 2) {
        //                 food.beEaten();
        //                 self.renderSnake(self.moveSinCos);

        //                 // for (let index = 0; index < 5; index++) {
        //                 //     self.renderSnake(self.moveSinCos);
        //                 // }
        //             }
        //         }

        //     } else { // 蛇身移逻辑
        //         if (secondFlag) {
        //             let xy = [];
        //             for (let j = 0; j < 2; j++) {
        //                 xy[j] = prevPos[j] - self.moveSinCos[j] * OFFSET;
        //                 // 蛇身也不要超过范围
        //                 if (xy[j] < self.limitArea[j][0]) xy[j] = self.limitArea[j][0];
        //                 if (xy[j] > self.limitArea[j][1]) xy[j] = self.limitArea[j][1];
        //             }
        //             prevPos = v.position;
        //             v.position = xy;
        //         }
        //     }
        // }
    }
};

function computerOffset(posA, posB) {
    let x = posA[0] - posB[0];
    let y = posA[1] - posB[1];
    let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return { sin: x / z, cos: y / z, z };
}
