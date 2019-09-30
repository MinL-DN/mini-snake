
const { getGuid } = require('../utils/index');
const Dom = require('../utils/dom');
const scenes = [];
let currentScene = null;

// base
module.exports = class Base {

    constructor(ctx) {
        this.aniId = 0;
        this.sceneId = getGuid();
        this.ctx = ctx;
        this.doms = [];

        currentScene = this;
        scenes.push(this);

        this.restart();
    }

    restart() {
        // 循环动画
        this.aniStartTime = Date.now();
        this.bindLoop = this.loop.bind(this);
        window.cancelAnimationFrame(this.aniId);
        this.aniId = window.requestAnimationFrame(this.bindLoop);
    }

    dom(params) {
        let _dom = new Dom(params, this);
        this.doms.push(_dom);
        return _dom;
    }

    findDom(domName) {
        return this.doms.find(v => v.domName == domName);
    }

    openScene(pageName) {

        let Scene = require('./' + pageName);

        if (Scene && Scene.constructor) {
            new Scene(this.ctx);
        } else {
            console.log('无此页面！');
        }
    }

    // loop
    loop(e) {

        this.DOMHighResTimeStamp = e;

        // 清除上一局的动画
        this.ctx.clearRect(...this.ctx.canvasOffset || [0, 0], canvas.width, canvas.height);

        this.doms.sort((a, b) => a.zoom - b.zoom > 0 ? 1 : -1).map(v => v.render());

        typeof this.update == 'function' && this.update(); // 每帧更新动画

        this.aniId = window.requestAnimationFrame(this.bindLoop);
    }
};

// 触点触摸 触点移动 触摸结束 事件
const touchEvents = ['onTouchStart', 'onTouchMove', 'onTouchEnd'];

for (let i = 0; i < touchEvents.length; i++) {
    let touchEvent = touchEvents[i];
    wx[touchEvent](function(e) {
        let touch = e.touches.length ? e.touches : e.changedTouches;

        let x = touch[0].clientX + (currentScene.ctx.canvasOffset ? currentScene.ctx.canvasOffset[0] : 0);
        let y = touch[0].clientY + (currentScene.ctx.canvasOffset ? currentScene.ctx.canvasOffset[1] : 0);

        for (let index in currentScene.doms) {
            let dom = currentScene.doms[index];
            // if (touchEvent == 'onTouchMove' && dom[touchEvent]) {
            //     'onTouchMove';
            //     touchEvent;
            // }
            if (
                typeof dom[touchEvent] == 'function' && dom.position &&
                x > dom.position[0] && x < dom.position[0] + dom.size[0] &&
                y > dom.position[1] && y < dom.position[1] + dom.size[1]
            ) {
                dom[touchEvent](e);
            }
        }
    });
}
