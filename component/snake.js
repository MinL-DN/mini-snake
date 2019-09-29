// snake 类
// const GradientColor = require('../utils/gradientColor');
const { getGuid, computerOffset }   = require('../utils/index');

const newCircle = require('./circle');

const COLORS = ['#00fffa', '#009aff', '#005fff', '#1700ff', '#8c00ff', '#eb00ff', '#ff00aa', '#ff0092', '#00ffee', '#ff007a'];
const OFFSET = 1;
const SPEED = 2;

module.exports = class Snake {

    constructor(params) {

        console.log('create a snake');

        let baseRandom = parseInt(Math.random() * 10);
        let snakeLen   = params.snakeLen || 20;

        Object.assign(this, {
            snakeId    : getGuid(),
            snakeBodys : [],
            colors     : params.isRobot ? [COLORS[baseRandom], '#eee'] : ['#ff0000', '#ffff00']
        }, params);

        this.computeSnake();

        this.circle = newCircle({ radius: this.radius, color: this.colors[0] });

        // 根据蛇身渲染蛇
        for (let i = 0; i < snakeLen; i++) {
            this.renderSnake();
        }

        this.moveSinCosHis = [];
    }

    /**
     * 生成蛇段实例
     * 需要蛇增长也调用此方法
     *
     * @param {*} this.snakeBodys[0] 是蛇头，其余是蛇身
     */
    renderSnake() {

        let position = [0, 0];

        let prev = this.snakeBodys[this.snakeBodys.length - 1];

        if (prev) {
            position = [prev.position[0] - OFFSET, prev.position[1]];
        } else {
            let x = Math.floor(Math.random() * (this.limitArea[0][1] - this.limitArea[0][0])) + this.limitArea[0][0];
            let y = Math.floor(Math.random() * (this.limitArea[1][1] - this.limitArea[1][0])) + this.limitArea[1][0];
            position = this.isRobot ? [x, y] : ['center', 'center'];
        }

        let snake = this.snakeCanvas.dom({
            name             : `snake-${this.snakeBodys.length.toString().padStart(5, 0)}-${this.snakeId}`,
            subCanvasContent : this.circle.ctx,
            position
        });

        snake.moveSinCos = [1, 0];

        this.snakeBodys.push(snake);

        this.computeSnake();
    }

    /**
     * 计算蛇的各种属性
     *
     * @param {*} msc moveSinCos 蛇移动的偏移量，若不需要则随机生成
     */
    computeSnake(msc) {

        let self = this;

        let snakeL = this.snakeBodys.length;
        let radius = snakeL / 4 + 25; // 根据蛇长算出蛇宽度
        let isBigger = this.radius !== radius; // 是否有变长
        this.radius = radius;

        if (this.snakeBodys[0]) {

            let his = {
                msc : JSON.parse(JSON.stringify(this.snakeBodys[0].moveSinCos)),
                pos : JSON.parse(JSON.stringify(this.snakeBodys[0].position))
            };

            // 蛇偏移量计算
            let offsetX = Math.random() * randomPlusMinus();
            let offsetY = Math.sqrt(Math.pow(1, 2) - Math.pow(offsetX, 2)) * randomPlusMinus();
            this.snakeBodys[0].moveSinCos = msc || [offsetX, offsetY];
            his.nextSinCos = JSON.parse(JSON.stringify(this.snakeBodys[0].moveSinCos));
            if (this.moveSinCosHis) this.moveSinCosHis.push(his);
        }

        if (isBigger) {

            // 计算界限
            this.limitArea = [
                [this.snakeCanvas.screenLimitArea[0][0], this.snakeCanvas.screenLimitArea[0][1] - this.radius],
                [this.snakeCanvas.screenLimitArea[1][0], this.snakeCanvas.screenLimitArea[1][1] - this.radius]
            ];

            // let snakeColor = new GradientColor(...this.colors, snakeL); // 蛇身渐变色
            let prevSnake = this.snakeCanvas.snakes[this.snakesIndex - 1];

            this.snakeBodys.forEach((v, i) => {
                // v.bg = snakeColor[i];
                // self.circle.size = [self.radius, self.radius];
                // self.circle.radius = self.radius;
                // self.circle.render();
                v.zoom = (prevSnake ? prevSnake.snakeBodys[0].zoom : 0) + snakeL - i;
            });
        }

        function randomPlusMinus() {
            return Math.random() > 0.5 ? 1 : -1;
        }
    }

    // 每帧更新方法
    autoMove() {

        let self = this;
        let snakeHead = self.snakeBodys[0];
        let dshp = []; // diff shake head poition
        let isHitWall = false; // 是否碰壁

        // 都是0的时候就停止移动
        if (!snakeHead || snakeHead.moveSinCos[0] == 0 && snakeHead.moveSinCos[1] == 0) return;

        // 横纵轴处理逻辑类似，此处用for循环处理，简化代码 0：X轴 1：Y轴
        for (let i = 0; i < 2; i++) {
            dshp[i] = snakeHead.position[i] + snakeHead.moveSinCos[i]; // 蛇头坐标
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

        // 蛇头赋值
        let headDis = computerOffset(snakeHead.position, self.snakeBodys[1].position);
        // 蛇移动（可以想象为蛇尾替换到蛇头的位置）
        if (headDis.z > OFFSET) {
            let tail = self.snakeBodys.pop();
            tail.position = dshp;
            tail.zoom = snakeHead.zoom;
            self.snakeBodys.unshift(tail);
            self.computeSnake(self.snakeBodys[1].moveSinCos);
        } else {
            snakeHead.position = dshp;
        }

        // return;

        // // 蛇头赋值
        // snakeHead.position = dshp;

        // let prevPos = dshp;
        // let preBody = '';

        // // 遍历蛇身
        // for (let i = 0; i < self.snakeBodys.length; i++) {

        //     const v = self.snakeBodys[i];

        //     if (!i) { // 蛇头碰撞逻辑

        //     } else { // 蛇身移逻辑
        //         let xy = [];

        //         let sinCos = v.moveSinCos;

        //         for (let j = 0; j < 2; j++) {
        //             xy[j] = v.position[j] + sinCos[j];
        //             // 蛇身也不要超过范围
        //             if (xy[j] < self.limitArea[j][0]) xy[j] = self.limitArea[j][0];
        //             if (xy[j] > self.limitArea[j][1]) xy[j] = self.limitArea[j][1];
        //         }

        //         v.position = xy;

        //         let distance = computerOffset(prevPos, v.position);

        //         // if (distance.z < OFFSET) { // 此状态表示此段位置将会在下次距离到达 OFFSET 时切换 movesincos
        //         //     distance;
        //         // } else if (distance.z > OFFSET) {
        //         //     v.moveSinCos = JSON.parse(JSON.stringify(preBody.moveSinCos));
        //         //     distance;
        //         // }
        //         let his = self.moveSinCosHis.find(_off => _off.msc[0] == v.moveSinCos[0] && _off.msc[1] == v.moveSinCos[1]);
        //         if (his && v.moveSinCos.join('-') != his.nextSinCos.join('-')) {
        //             if (
        //             // (his.msc[0] == 0 ||
        //             // his.msc[0] > 0 && v.position[0] >= his.pos[0] ||
        //             // his.msc[0] < 0 && v.position[0] <= his.pos[0]) &&
        //             // (his.msc[1] == 0 ||
        //             // his.msc[1] > 0 && v.position[1] >= his.pos[1] ||
        //             // his.msc[1] < 0 && v.position[1] <= his.pos[1])

        //                 Math.abs(v.position[0]) - Math.abs(his.pos[0]) < Number.EPSILON && Math.abs(v.position[1]) - Math.abs(his.pos[1]) < Number.EPSILON
        //             ) {
        //                 v.moveSinCos = his.nextSinCos;
        //             }
        //         }

        //         // if (i + 1 == self.snakeBodys.length && v.moveSinCos.join('--') == ) {

        //         // }


        //         this.moveSinCosHis;

        //         prevPos = v.position;
        //     }

        //     preBody = v;
        // }
    }
};
