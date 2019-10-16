
// const { regeneratorRuntime } = require('./index.js');

// 加载资源
module.exports = class LoadRe {
    constructor() {
        this.reList = [
            'public/images/bg.jpg'
            // 'public/images/skin1.png'
        ];
        this.re = {};
    }

    load() {
        return Promise.all(this.reList.map(v => this.add(v, v)));
    }

    add(name, src) {

        let self = this;

        this.re[name] = wx.createImage();
        this.re[name].src = src;

        return new Promise(res => {
            self.re[name].onload = function() {
                res(this);
            };
        });
    }
};
