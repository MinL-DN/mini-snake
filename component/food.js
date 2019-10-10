// 食物奖品类

const Canvas = require('../utils/canvas');
const { getGuid } = require('../utils/index');
const Circle = require('./circle');

const COLORS = ['#00fffa', '#009aff', '#005fff', '#1700ff', '#8c00ff', '#eb00ff', '#ff00aa', '#ff0092', '#00ffee', '#ff007a'];

// food 层离屏渲染
module.exports = class FoodCanvas extends Canvas {

    constructor(params) {

        super('food', params.scene.bgDom.size);

        this.scene = params.scene;
        this.foods = [];

        for (let i = 0; i < 1; i++) {
            this.foods.push(this.createFood());
        }
    }

    createFood() {
        let radius = 20;
        let color  = COLORS[parseInt(Math.random() * 10)];

        let xy = this.scene.randomCoordinates(radius);

        let circlePage = window.canvasPage.find(v => v.canvasName == 'circle' && v.doms[0].radius == radius && v.doms[0].color == color);
        let circleCtx = circlePage ? circlePage.ctx : new Circle({ radius, color });

        // this.scene.screenCanvas.dom({
        //     name     : '1',
        //     subCtx   : circleCtx,
        //     position : [0, 0],
        //     zoom     : 100
        // });

        // 生成食物段实例
        this.dom({
            name     : `food-${getGuid()}`,
            position : xy,
            subCtx   : circleCtx,
            zoom     : this.foods.length + 1
        });
    }

    // 销毁自身
    beEaten() {
        let self = this;
        self.scene.foods = self.scene.foods.filter(food => food.domId != self.domId);
        self.scene.doms = self.scene.doms.filter(dom => dom.domId != self.domId);
    }
};
