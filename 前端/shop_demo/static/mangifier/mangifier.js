var that = null
class Mangifier{
    constructor(config) {
        that = this
        // 默认配置
        this.config = {
            selector: "#man",
            width: 300,
            height:400,
            distance: 50,
        }

        // 默认合并传入的配置
        Object.assign(this.config,config)

        this.bigPic = document.querySelector(this.config.selector)
        // console.log(this.bigPic)
        this.maskWidth = this.bigPic.offsetWidth / 2
        this.maskHeight = this.bigPic.offsetHeight / 2

        this.init()

    }

    init() {
        this.initMask()
        this.initMegaloscope()
        //鼠标进入
        this.bigPic.onmouseenter = this.show;
        //鼠标移动
        this.bigPic.onmousemove = this.mangifierFunc;
        //鼠标离开
        this.bigPic.onmouseleave = this.hide;
    }
    show() {
        that.mask.style.display = 'block'
        that.megaloscope.style.display = 'block'
    }
    mangifierFunc(e) {
        this.maskX = e.clientX - that.bigPic.offsetLeft - that.mask.offsetWidth / 2;
        this.maskY = e.clientY - that.bigPic.offsetTop - that.mask.offsetHeight / 2;

        // 限制xy的最大值
        // this.maskX = this.maskX >= that.bigPic.offsetWidth / 2  ? that.bigPic.offsetWidth / 2:this.maskX
        // this.maskY = this.maskY >= that.bigPic.offsetHeight / 2  ? that.bigPic.offsetHeight / 2:this.maskY
        // 限制xy的最小值
        // this.maskX = this.maskX <= 0 ? 0:this.maskX
        // this.maskY = this.maskY <= 0 ? 0:this.maskY
        // 语法糖版本
        this.maskX = this.maskX >= that.bigPic.offsetWidth / 2  ? that.bigPic.offsetWidth / 2:this.maskX <= 0 ? 0:this.maskX
        this.maskY = this.maskY >= that.bigPic.offsetHeight / 2  ? that.bigPic.offsetHeight / 2:this.maskY <= 0 ? 0:this.maskY

        // 放大镜移动
        that.mask.style.left = this.maskX + 'px';
        that.mask.style.top = this.maskY + 'px';

        // 放大之后移动
        let b = (that.megaloscopeImg.offsetWidth - that.megaloscope.offsetWidth + 2) / that.mask.offsetWidth
        that.megaloscopeImg.style.top = -this.maskY * b + 'px'
        that.megaloscopeImg.style.left = -this.maskX * b + 'px'
    }
    hide() {
        that.mask.style.display = 'none'
        that.megaloscope.style.display = 'none'
    }

    initMask() {
        // 创建遮罩层
        this.mask = document.createElement('div')
        this.mask.className = "mask"
        this.mask.style.height = this.maskHeight + 'px'
        this.mask.style.width = this.maskWidth + 'px'
        // 将mask追加到bigPic中
        this.bigPic.appendChild(this.mask)
    }

    initMegaloscope() {
        // 创建Megaloscope
        this.megaloscope = document.createElement('div');
        this.megaloscope.className = "megaloscope"
        this.megaloscope.style.width = this.config.width + 'px'
        this.megaloscope.style.height = this.config.height + 'px'
        this.megaloscope.style.left = this.bigPic.offsetWidth + this.config.distance + 'px'

        // 创建 创建Megaloscope > img 对象
        this.megaloscopeImg = document.createElement('img');
        this.megaloscopeImg.src = this.bigPic.querySelector('img').src
        console.log(this.megaloscopeImg.src)
        this.megaloscope.appendChild(this.megaloscopeImg)
        this.bigPic.appendChild(this.megaloscope)
    }
}

