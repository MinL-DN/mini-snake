// 食物奖品类

const Dom = require('../utils/dom');
const { getGuid } = require('../utils/index');
const Circle = require('./circle');

const COLORS = ['#00fffa', '#009aff', '#005fff', '#1700ff', '#8c00ff', '#eb00ff', '#ff00aa', '#ff0092', '#00ffee', '#ff007a'];

module.exports = function(params) {
    let radius = 20;

    // 计算界限
    let limitArea = params.scene.limitArea(radius);

    let x = Math.floor(Math.random() * (limitArea[0][1] - limitArea[0][0])) + limitArea[0][0];
    let y = Math.floor(Math.random() * (limitArea[1][1] - limitArea[1][0])) + limitArea[1][0];

    let circlePage = window.canvasPage.find(v => v.canvasName == 'circle' && v.doms[0].radius == self.radius && v.doms[0].color == self.colors);
    let circleCtx = circlePage ? circlePage.ctx : new Circle({ radius: radius, color: COLORS[parseInt(Math.random() * 10)] });

    // 生成食物段实例
    params.scene.screenCanvas.dom({
        name     : `food-${getGuid()}`,
        position : [x, y],
        subCtx   : circleCtx,
        zoom     : 2
    });
};

// class Food extends Dom {

//     constructor(params) {
//     }

//     // 销毁自身
//     beEaten() {
//         let self = this;
//         self.scene.foods = self.scene.foods.filter(food => food.domId != self.domId);
//         self.scene.doms = self.scene.doms.filter(dom => dom.domId != self.domId);
//     }
// }
