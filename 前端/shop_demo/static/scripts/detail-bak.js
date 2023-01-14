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
// 2.放大镜 使用类
{
    new Mangifier({
        selector:'#man',
        width: 400,
        height: 400,
        distance: 50,
    })
}