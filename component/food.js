// snake 类

const Dom = require('../utils/dom');
const { getGuid } = require('../utils/index');

const COLORS = ['#00fffa', '#009aff', '#005fff', '#1700ff', '#8c00ff', '#eb00ff', '#ff00aa', '#ff0092', '#00ffee', '#ff007a'];

module.exports = class Food extends Dom {

    constructor(params) {

        let baseRandom = parseInt(Math.random() * 10);
        let radius = 20;

        // 计算界限
        let limitArea = [
            [params.scene.limitArea[0][0], params.scene.limitArea[0][1] - radius],
            [params.scene.limitArea[1][0], params.scene.limitArea[1][1] - radius]
        ];

        let x = Math.floor(Math.random() * (limitArea[0][1] - limitArea[0][0])) + limitArea[0][0];
        let y = Math.floor(Math.random() * (limitArea[1][1] - limitArea[1][0])) + limitArea[1][0];

        // 生成食物段实例
        let data = {
            name     : `food-${getGuid()}`,
            position : [x, y],
            bg       : COLORS[baseRandom] || '#eee',
            zoom     : 0,
            size     : [radius, radius],
            radius   : radius
        };

        super(data, params.scene);

        params.scene.doms.push(this);
    }

    // 销毁自身
    beEaten() {
        let self = this;
        self.scene.foods = self.scene.foods.filter(food => food.domId != self.domId);
        self.scene.doms = self.scene.doms.filter(dom => dom.domId != self.domId);
    }
};
