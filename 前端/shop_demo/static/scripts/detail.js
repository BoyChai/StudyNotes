// 1.小图片切换
{
    var productImgList = [
        {small:"./static/images/goods/1-small.png",big:"./static/images/goods/1-big.png"},
        {small:"./static/images/goods/2-small.png",big:"./static/images/goods/2-big.png"},
        {small:"./static/images/goods/3-small.png",big:"./static/images/goods/3-big.png"},
        {small:"./static/images/goods/4-small.png",big:"./static/images/goods/4-big.png"},
        {small:"./static/images/goods/5-small.png",big:"./static/images/goods/5-big.png"},
        {small:"./static/images/goods/6-small.png",big:"./static/images/goods/6-big.png"},
        {small:"./static/images/goods/7-small.png",big:"./static/images/goods/7-big.png"},
        {small:"./static/images/goods/8-small.png",big:"./static/images/goods/8-big.png"},
        {small:"./static/images/goods/9-small.png",big:"./static/images/goods/9-big.png"},
    ]

    // 获取左右切换按钮
    let leftArrow = document.querySelector(".small-list .arrow-l")
    let rightArrow = document.querySelector(".small-list .arrow-r")

    // 获取图片列表
    let smallImgDomList = document.querySelector(".small-list .list>div")
    // 定义图片列表索引
    let smallImgIndex = 0;

    // 绑定左右滚动
    leftArrow.onclick = function () {
        let start = smallImgIndex * 64;
        smallImgIndex++;
        smallImgIndex=smallImgIndex > productImgList.length - 5 ? 4:smallImgIndex
        let target = smallImgIndex * 64;

        setInterval(function () {
            start ++
            if (start >= target){
                return
            }
            smallImgDomList.style.left = -start + 'px';
        },1)
        // smallImgDomList.style.left = -target + 'px';
    }
    rightArrow.onclick = function () {
        let start = smallImgIndex * 64;
        smallImgIndex--;
        smallImgIndex=smallImgIndex < 0 ? 0:smallImgIndex
        let target = smallImgIndex * 64;
        setInterval(function () {
            start --
            if (start <= target){
                return
            }
            smallImgDomList.style.left = -start + 'px';
        },1)
        // smallImgDomList.style.left = -target + 'px';
    }
}

// 2.放大镜
{
    // 获取对象
    let bigPic = document.querySelector(".big-pic")
    let bigPicImg = document.querySelector(".big-pic>img")
    let mask = document.querySelector(".mask")
    let megaloscope = document.querySelector(".megaloscope")
    let megaloscopeImg =document.querySelector(".megaloscope>img")
    let smallImgObjList = document.querySelectorAll(".small-list .list img")

    bigPic.onmouseenter = function () {
        mask.style.display='block'
        megaloscope.style.display='block'
    }
    bigPic.onmouseleave = function () {
        mask.style.display='none'
        megaloscope.style.display='none'
    }
    bigPic.onmousemove = function (e) {
        // 获取mask对象的left和top的值
        // clientX和clientY分别是鼠标与浏览器最左侧的距离和鼠标与浏览器最右侧的距离
        let maskX = e.clientX - this.offsetLeft - mask.offsetWidth/2
        let maskY = e.clientY - this.offsetTop - mask.offsetHeight/2
        // 限制左右最大值
        maskX = maskX > 200 ? 200:maskX
        maskY = maskY > 200 ? 200:maskY
        maskX = maskX < 0 ? 0:maskX
        maskY = maskY < 0 ? 0:maskY

        mask.style.left = maskX+'px';
        mask.style.top = maskY+'px';

        // 计算放大倍数
        // 加2是边框的大小
        let b = (megaloscopeImg.offsetWidth - megaloscope.offsetWidth + 2 ) / mask.offsetWidth
        megaloscopeImg.style.left = -maskX*b + 'px'
        megaloscopeImg.style.top = -maskY*b + 'px'
    }

    smallImgObjList.forEach(function (item,index){
        item.onmouseenter = function () {
            item.style.border = '2px solid #B1191A'
            bigPicImg.src = productImgList[index].big
            megaloscopeImg.src = productImgList[index].big
        }
        item.onmouseleave = function () {
            item.style.border = ''
        }
        // item.onclick = function () {
        //     bigPicImg.src = productImgList[index].big
        //     megaloscopeImg.src = productImgList[index].big
        // }
    })
}

// 3.选择规格
{
    // 获取对象
    let colorAttr = document.querySelectorAll(".select-color a")
    let versionAttr = document.querySelectorAll(".select-version a")
    let typeAttr = document.querySelectorAll(".select-type a")


    clickFunc(colorAttr)
    clickFunc(versionAttr)
    clickFunc(typeAttr)


    // 选择函数
    function clickFunc(attr) {
        attr.forEach(function (item) {
            item.onclick = function () {
                attr.forEach(function (item) {
                    item.style.border = '2px solid #f0f0f0'
                })
                this.style.border = '2px solid #C81623'
            }
        })
    }

}

// 4.加减购买数量
{
    // 获取对象
    let numInput = document.querySelector(".amount .num")
    let addBtn = document.querySelector(".add")
    let reduceBtn = document.querySelector(".reduce")


    addBtn.onclick = function () {
        numInput.value++
        reduceBtn.style.cursor = 'pointer'
    }
    reduceBtn.onclick = function () {
        if(numInput.value<=1) {
            return
        } else if (numInput.value == 2) {
            this.style.cursor='not-allowed'
        }
        numInput.value--
    }
}
