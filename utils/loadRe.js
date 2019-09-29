
const { regeneratorRuntime } = require('./index.js');

// 加载资源
module.exports = class LoadRe {
    constructor() {
        this.reList = [
            'public/images/bg.jpg'
        ];
        this.re = {};
    }

    async load() {

        let self = this;

        await Promise.all(self.reList.map(v => getImg(v)))
            .then(_reList => {
                _reList.forEach((v, i) => {
                    self.re[self.reList[i]] = v;
                });
            });

        return self.re;
    }
};

function getImg(src) {
    return new Promise(res => {
        let img = wx.createImage();
        img.src = src;
        img.onload = () => res(img);
    });
}
