// snake 类

// const GradientColor = require('../utils/gradientColor');
const { getGuid } = require('../utils/index'); // computerOffset
const getCircleImg = require('./circle');

const COLORS = ['#00fffa', '#009aff', '#005fff', '#1700ff', '#8c00ff', '#eb00ff', '#ff00aa', '#ff0092', '#00ffee', '#ff007a'];
const DELAY  = 5; // 延时出发标志位、相当于每隔 60 * 5 帧时可以对新生成蛇身进行 autoMove

module.exports = class Snake {

    constructor(params) {

        console.log('create a snake');

        let baseRandom = parseInt(Math.random() * 10);
        let isRobot    = params.snakesIndex !== 0;

        Object.assign(this, {
            isRobot,
            snakeLen   : 10,
            speed      : 2.5,
            snakeId    : getGuid(),
            snakeBodys : [],
            trajectory : [],
            colors     : isRobot ? [COLORS[baseRandom], '#eee'] : ['#ff0000', '#ffff00'],
            dshp       : [] // diff shake head poition
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
        // 依据蛇长渲染蛇身
        this.renderSnake();

        let prevSnake = this.scene.snakes[this.snakesIndex - 1];

        // 遍历蛇身 设置 position、zoom 属性、当增长时更新 img、size 属性
        for (let i = 0; i < this.snakeBodys.length; i++) {

            let v = this.snakeBodys[i];
            let pre = this.snakeBodys[i - 1];

            if (v.moveTime === undefined) v.moveTime = 0;
            if ((!pre || pre.moveTime == DELAY) && v.moveTime < DELAY) v.moveTime++;

            // 根据蛇是否变长更新蛇属性
            // let imgCtx = subtract > 0 ? new Circle({ radius: this.radius, color: this.snakeColor[i] }) : '';
            // if (imgCtx) {
            //     v.img = imgCtx.canvas;
            //     v.size = JSON.parse(JSON.stringify(imgCtx.canvasInnerWH));
            // }
            // v.size = JSON.parse(JSON.stringify(this.circleCtx.canvasInnerWH));

            v.zoom = (prevSnake ? prevSnake.snakeBodys[0].zoom : 0) + this.snakeBodys.length - i;

            if (v.moveTime == DELAY) {

                if (pre) { // 蛇身

                    let prePos = this.trajectory.findIndex(_t => _t[0] == v.position[0] && _t[1] == v.position[1]);
                    let thisPos = this.trajectory[prePos + 1];

                    v.position = JSON.parse(JSON.stringify(thisPos));

                    // 无用轨迹祛除 当遍历到蛇尾时并存在已使用轨迹
                    if (i == this.snakeBodys.length - 1 && prePos != -1) this.trajectory.shift();

                } else { // 蛇头
                    v.position = JSON.parse(JSON.stringify(this.dshp));
                    this.trajectory.push(v.position);
                }
            }

            if (i == 0) {

                // // 蛇头碰撞逻辑
                // // 与其他蛇碰撞
                // for (let j = 0; j < this.scene.snakes.length; j++) {

                //     const snake = this.scene.snakes[j];
                //     if (snake.snakeId == this.snakeId) continue;

                //     let { z } = computerOffset(snake.snakeBodys[0].position, v.position);
                //     if (z <= v.size[0]) {
                //         if (!snake.isRobot) { // 玩家蛇碰撞
                //         // console.log(`snake ${snake.snakeId} hit ${this.snakeId}`);
                //         }
                //     }
                // }

                // // 与食物碰撞
                // for (let j = 0; j < this.scene.foodSubCanvasDom.subCanvas.doms.length; j++) {
                //     const food = this.scene.foodSubCanvasDom.subCanvas.doms[j];

                //     if (!/food-/.test(food.name)) continue;

                //     let { z } = computerOffset([
                //         food.position[0] + food.size[0] / 2,
                //         food.position[1] + food.size[1] / 2
                //     ], [
                //         v.position[0] + food.size[0] / 2,
                //         v.position[1] + food.size[1] / 2
                //     ]);
                //     // let { z } = computerOffset(food.position, v.position);

                //     if (z < (this.radius + food.size[0] / 2) / 2) {
                //         this.scene.foodSubCanvasDom.subCanvas.reRender(food);
                //         this.snakeLen++;
                //         break;
                //     }
                // }
            }
        }
    }

    /**
     * 依据蛇长渲染蛇
     * 根据 蛇长度差 进行操作
     * 需要增长蛇的话就对 this.snakeLen++;
     *
     */
    renderSnake() {

        let subtract = this.snakeLen - this.snakeBodys.length;
        if (subtract <= 0) return;

        for (let i = 0; i < subtract; i++) {
            // let _l = this.snakeBodys.length + 1;
            // 根据蛇长算出蛇宽度
            // this.radius = _l / 4 + 25;
            this.radius = 25;

            // 计算界限
            this.limitArea = this.scene.limitArea(this.radius);

            // // 蛇身渐变色
            // this.snakeColor = new GradientColor(...this.colors, _l);

            this.circle = getCircleImg({ radius: this.radius, color: this.colors[0], border: 1 });

            let position = [0, 0];

            let prev = this.snakeBodys[this.snakeBodys.length - 1];

            if (prev) {
                position = JSON.parse(JSON.stringify(prev.position));
            } else {
                let xy = this.scene.randomCoordinates(this.radius);
                position = this.isRobot ? xy : ['center', 'center'];
            }

            let snakeB = this.scene.screenCanvas.dom({
                name : `snake-${this.snakeBodys.length.toString().padStart(5, 0)}-${this.snakeId}`,
                img  : this.circle.img,
                size : this.circle.ctx.canvasInnerWH,
                position
            });

            this.snakeBodys.push(snakeB);
        }
    }

    /**
     * 每帧更新方法
     *
     */
    autoMove() {

        let snakeHead = this.snakeBodys[0]; // this.snakeBodys[0] 是蛇头，其余是蛇身
        let isHitWall = false; // 是否碰壁

        // sin cos 都是0 非移动状态
        if (this.moveSinCos[0] == 0 && this.moveSinCos[1] == 0) return;

        // 计算 this.dshp 蛇头位置偏移
        // 横纵轴处理逻辑类似，此处用for循环处理，简化代码 0：X轴 1：Y轴
        for (let i = 0; i < 2; i++) {
            this.dshp[i] = snakeHead.position[i] + this.moveSinCos[i] * this.speed; // 蛇头坐标
            if (this.dshp[i] <= this.limitArea[i][0] || this.dshp[i] >= this.limitArea[i][1]) { // 边界碰撞处理
                isHitWall = true;
            }
        }

        if (this.isRobot && (Math.random() * 100 < 1 || isHitWall)) { // 机器蛇 随机转向 或者将要碰墙时自动调转方向
            return this.turnDir();
        } else if (isHitWall) { // 玩家蛇 撞墙弹框提示并且终止游戏
            this.isHitWall = isHitWall;
            return;
        }
        // else if (!this.isRobot && Math.random() * 100 < 1) { // 自动生长
        //     this.snakeLen++;
        // }

        // 蛇各种属性计算
        this.computeSnake();
    }
};
