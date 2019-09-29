
module.exports = {

    regeneratorRuntime: require('./libs/runtime'),

    getGuid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    },

    // 根据坐标计算距离
    computerOffset(posA, posB) {
        let x = posA[0] - posB[0];
        let y = posA[1] - posB[1];
        let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) || 0;
        return { sin: x / z || 0, cos: y / z || 0, z };
    },

    // 触点触摸 触点移动 触摸结束 事件
    handleEvent(dom, offset = [0, 0]) {

        const touchEvents = ['onTouchStart', 'onTouchMove', 'onTouchEnd'];

        for (let i = 0; i < touchEvents.length; i++) {
            let touchEvent = touchEvents[i];
            wx[touchEvent](function(e) {
                let touch = e.touches.length ? e.touches : e.changedTouches;

                let x = touch[0].clientX + offset[0];
                let y = touch[0].clientY + offset[1];

                if (
                    typeof dom[touchEvent] == 'function' && dom.position &&
                    x > dom.position[0] && x < dom.position[0] + dom.size[0] &&
                    y > dom.position[1] && y < dom.position[1] + dom.size[1]
                ) {
                    dom[touchEvent](e);
                }

                // for (let index in currentScene.doms) {
                //     let dom = currentScene.doms[index];
                //     if (touchEvent == 'onTouchMove' && dom[touchEvent]) {
                //         'onTouchMove';
                //         touchEvent;
                //     }
                // }
            });
        }
    }
};
