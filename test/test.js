module.exports = class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = this.canvas.getContext('2d');

        this.amount = 200; // 粒子总数量
        this.radius = 5; // 粒子半径
        this.particles = []; // 粒子集合
        this.speed = 10; // 粒子速度
        this.timer = null; // 定时器

        this.useOffCanvas = false; // 是否使用离屏渲染

        this.count = 0; // 计算动画执行的次数
        this.time = new Date().getTime(); // 起始时间
        // this.fpsDom = document.getElementById('fps'); // 展示fps的dom元素

        this.init();
    }

    init() {
        this.particles = [];
        this.timer = null;
        this.count = 0;
        this.time = new Date().getTime();

        let particle = new Particle(this.radius);

        // 随机位置生成粒子
        for (let i = 0; i < this.amount; i++) {
            let rx = Math.floor(this.radius + Math.random() * (this.width - this.radius * 2));
            let ry = Math.floor(this.radius + Math.random() * (this.height - this.radius * 2));

            if (this.useOffCanvas) {

                this.particles.push({
                    instance : particle,
                    x        : rx,
                    y        : ry,
                    isMax    : false
                });
            } else {
                this.particles.push({
                    x     : rx,
                    y     : ry,
                    isMax : false
                });
                this.drawParticle(this.ctx, rx, ry, this.radius);
            }
        }

        this.animate();

        console.log((this.useOffCanvas ? '使用' : '关闭') + '离屏渲染');
    }

    /* 绘制一个粒子
     * ctx —— canvas上下文
     * x —— 圆心x坐标
     * y —— 圆心y坐标
     * r —— 圆半径
     */
    drawParticle(_ctx, x, y, r) {
        _ctx.fillStyle = 'red';
        _ctx.beginPath();
        _ctx.arc(x, y, r, 0, 2 * Math.PI);
        _ctx.closePath();
        _ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];

            if (particle.isMax) {
                particle.y -= this.speed;
                if (particle.y <= 0 + this.radius) {
                    particle.isMax = false;
                    particle.y += this.speed;
                }
            } else {
                particle.y += this.speed;
                if (particle.y >= this.height - this.radius) {
                    particle.isMax = true;
                    particle.y -= this.speed;
                }
            }

            if (this.useOffCanvas) {
                particle.instance.move(this.ctx, particle.x, particle.y);
            } else {
                this.drawParticle(this.ctx, particle.x, particle.y, this.radius);
            }
        }

        let self = this;
        this.timer = requestAnimationFrame(() => {
            // 计算fps
            self.computedFps();

            self.animate();
        });
    }

    // 更新粒子数量
    updateAmount(amount) {
        cancelAnimationFrame(this.timer);
        this.amount = Number(amount);
        this.init();
    }

    // 切换渲染方式
    toggleRender() {
        cancelAnimationFrame(this.timer);
        this.useOffCanvas = !this.useOffCanvas;
        this.init();
    }

    // 计算fps
    computedFps() {
        let now = new Date().getTime();
        if (now - this.time >= 1000) {
            this.time = now;
            // this.fpsDom.innerHTML = this.count;
            console.log(this.count);
            this.count = 0;
        } else {
            this.count++;
        }
    }
};

// 粒子类
class Particle {
    constructor(r) {
        this.canvas = wx.createCanvas();
        this.width = this.canvas.width = r * 2;
        this.height = this.canvas.height = r * 2;
        this.ctx = this.canvas.getContext('2d');
        this.x = this.width / 2;
        this.y = this.height / 2;
        this.r = r;

        this.create();
    }

    // 创建粒子
    create() {
        this.ctx.save();
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    // 移动粒子
    move(_ctx, x, y) {
        _ctx.drawImage(this.canvas, x, y);
    }
}