// 食物奖品类

const Canvas = require('../utils/canvas');
const { getGuid } = require('../utils/index');
const Circle = require('./circle');

const COLORS = ['#00fffa', '#009aff', '#005fff', '#1700ff', '#8c00ff', '#eb00ff', '#ff00aa', '#ff0092', '#00ffee', '#ff007a'];

// food 层离屏渲染
module.exports = class FoodCanvas extends Canvas {

    constructor(params) {

        super({
            name : 'food',
            wh   : params.scene.bgDom.size
        });

        this.scene = params.scene;

        for (let i = 0; i < 50; i++) {
            this.createFood();
        }
    }

    createFood() {
        let radius = 20;
        let color  = COLORS[parseInt(Math.random() * 10)];

        let xy = this.scene.randomCoordinates(radius);

        let circlePage = window.canvasPage.find(v => v.canvasName == 'circle' && v.doms[0].radius == radius && v.doms[0].color == color);
        let circleCtx = circlePage ? circlePage.ctx : new Circle({ radius, color });

        // this.dom({
        //     position : [0, 0],
        //     size     : [500, 500],
        //     bg       : 'rgba(255,0,0,0.1)',
        //     zoom     : -1
        // });

        // 生成食物段实例
        this.dom({
            name      : `food-${getGuid()}`,
            position  : xy,
            subCanvas : circleCtx,
            zoom      : this.doms.length + 1
        });
    }

    // 重渲染
    reRender(food) {
        let size = food.size[0] / 2;
        this.ctx.clearRect(...food.position, ...food.size); // 清除上一局的动画
        food.position = this.scene.randomCoordinates(size);
        food.render();
    }
};
