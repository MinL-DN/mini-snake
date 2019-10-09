
module.exports = {
    regeneratorRuntime: require('./libs/runtime'),

    // guid
    getGuid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    },

    // 计算两点之间距离
    computerOffset(posA, posB) {
        let x = posA[0] - posB[0];
        let y = posA[1] - posB[1];
        let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return { sin: x / z, cos: y / z, z };
    }
};
