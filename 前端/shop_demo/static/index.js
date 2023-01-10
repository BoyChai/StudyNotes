{
// 1.轮播图
	var swiperImageList = [
		"/shop_demo/static/uploads/slider-1.png",
		"/shop_demo/static/uploads/slider-2.png",
		"/shop_demo/static/uploads/slider-3.png",
		"/shop_demo/static/uploads/slider-4.jpg"
	];
	
	// 拿到切换图片按钮对象
	var leftArrow = document.querySelector(".swiper-box .arrow-r");
	var rightArrow = document.querySelector(".swiper-box .arrow-l");
	
	// 拿到轮播图的a标签
	var swiperA = document.querySelector(".swiper-box .swiper a")

	// 获取所有的切换圆点
	var circleBtns = document.querySelectorAll(".circle li")

	// 轮播图索引
	var swiperIndex = 0;
	
	// 轮播图按钮
	leftArrow.onclick = function (){
		// indexCheck("-")
		swiperIndex--
		swiperIndex = swinswiperIndex <= 0 ? swiperImageList.length:swiperIndex;
		swiperA.style.backgroundImage = `url(${swiperImageList[swiperIndex]})`
		activeCircle(swiperIndex)
	}
	rightArrow.onclick = function (){
		// indexCheck("+")
		swiperIndex++
		swiperIndex = swiperIndex >= swiperImageList.length ? 0:swiperIndex;
		swiperA.style.backgroundImage = `url(${swiperImageList[swiperIndex]})`
		activeCircle(swiperIndex)
	}
	console.log(circleBtns)
	//为所有的小圆点索引注册点击时间
	circleBtns.forEach(function (item,index) {
		item.onclick = function () {
			swiperIndex = index
			swiperA.style.backgroundImage = `url(${swiperImageList[swiperIndex]})`
			activeCircle(swiperIndex)
		}
	})
	
	// tools
	// 轮播图索引纠正 
	// 佛了 上面有语法糖版本的
	var indexCheck = function (method) {
		if (method == "+") {
			if (swiperIndex==swiperImageList.length-1) {
				swiperIndex = 0
				return
			}
			swiperIndex ++
			return
		}
		if (swiperIndex==0) {
			swiperIndex = swiperImageList.length-1
			return
		}
		swiperIndex --
		return
	}
	// 切换圆点样式更换
	function activeCircle(id) {
		circleBtns.forEach(function (item,index) {
			item.className=""
			// if (index == id) {
			// 	item.className="active"
			// }
		})
		circleBtns[id].className="active"
	}

}