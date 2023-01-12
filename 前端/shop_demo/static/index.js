// 1.轮播图
{
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

	// 声明定时器变量
	var timer = ""

	// 声明一个变量，用来控制是否能够切换图标
	// true能切换 false不能切换
	// 想让左右两边按钮有冷却时间
	var flag = true;
	
	// 轮播图按钮
	leftArrow.onclick = function (){
		if (flag == false) {
			return
		}
		flag = false
		// indexCheck("-")
		swiperIndex--
		swiperIndex = swinswiperIndex <= 0 ? swiperImageList.length:swiperIndex;
		swiperA.style.backgroundImage = `url(${swiperImageList[swiperIndex]})`
		activeCircle(swiperIndex)
		setTimeout(function () {
			flag = true
		},1000)
	}
	rightArrow.onclick = function (){
		if (flag == false) {
			return
		}
		flag = false
		// indexCheck("+")
		swiperIndex++
		swiperIndex = swiperIndex >= swiperImageList.length ? 0:swiperIndex;
		swiperA.style.backgroundImage = `url(${swiperImageList[swiperIndex]})`
		activeCircle(swiperIndex)
		setTimeout(function () {
			flag = true
		},1000)
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

    // 轮播图自动播放
	function autoSwiper() {
		timer = setInterval(function () {
			swiperIndex++
			swiperIndex = swiperIndex >= swiperImageList.length ? 0:swiperIndex;
			swiperA.style.backgroundImage = `url(${swiperImageList[swiperIndex]})`
			activeCircle(swiperIndex)
		},2000)
	}
	autoSwiper()

  	// 鼠标悬浮停止轮播
	swiperA.onmouseenter = function (){
		clearInterval(timer)
	}
	// 鼠标移走继续切换
	swiperA.onmouseleave = function () {
		autoSwiper()
	}
	//左右箭头小圆点注册鼠标悬浮停止以及移走继续切换
	leftArrow.onmouseenter = function (){
		clearInterval(timer)
	}
	leftArrow.onmouseleave = function () {
		autoSwiper()
	}
	rightArrow.onmouseenter = function (){
		clearInterval(timer)
	}
	rightArrow.onmouseleave = function () {
		autoSwiper()
	}
	circleBtns.forEach(function (item) {
		//这个是使用foreach给里面的li标签每个都加 也可以获取到ul给ul加上
		item.onmouseenter = function (){
			clearInterval(timer)
		}
		item.onmouseleave = function () {
			autoSwiper()
		}
	})

}

// 2.秒杀倒计时
{
	// 获取时分秒的dom元素
	var hourDom = document.querySelector("#hour")
	var minDom = document.querySelector("#min")
	var secDom = document.querySelector("#sec")

	// 结束时间点相差的秒数
	var endTime = +new Date('2024-01-11 20:00:00')
	countDown()
	// 每秒计算时间并渲染
	setInterval(function () {
		countDown()
	},1000)
	function countDown() {
		// 计算当前时间
		var nowTime = Date.now()

		// 计算和秒杀时间相差多少秒并取整math.ceil
		var secs = Math.ceil((endTime - nowTime)/1000)

		// 计算多少小时
		var h = parseInt(secs/3600)
		h = h < 10 ? '0' + h:h;

		// 去除多少小时之后计算剩下多少分钟,并取整
		var i = parseInt(secs % 3600 / 60)
		i = i < 10 ? '0' + i:i;

		//计算除去小时和分钟还剩多少秒
		var s = secs % 3600 % 60
		s = s < 10 ? '0' +s:s;

		// 将计算好的数据渲染到html里面
		hourDom.innerText = h
		minDom.innerText = i
		secDom.innerText = s
	}

}

// 3.秒杀图片滚动
{
	var msUL = document.querySelector(".miaosha-goods ul")
	var pos = 0
	var rollTimer = null

	function autoRoll() {
		rollTimer=setInterval(function () {
			if (pos == -2020){
				pos=0
			}
			msUL.style.left=--pos+'px'
		},0)
	}
	autoRoll()
	msUL.onmouseenter = function () {
		clearInterval(rollTimer)
	}
	msUL.onmouseleave = function () {
		autoRoll()
	}
}

// 4.左侧电梯导航
{
	// 获取电梯导航栏的ul对象
	var menu = document.querySelector(".menu")

	// 获取优购秒杀对象
	var ms = document.querySelector(".miaosha")
	// 输出ms这个对象距离顶端的像素
	// console.log(ms.offsetTop)

	// 获取各个楼层对象
	var cates = document.querySelectorAll(".cate")
	// 存储所有楼层坐标的变量
	var tops = []
	for (let i = 0; i < cates.length; i++) {
		tops.push(cates[i].offsetTop)
	}
	console.log(tops)

	// 获取所有楼层按钮,并注册点击事件
	var btns = document.querySelectorAll('.menu li')
	console.log(btns)
	for (let i = 0; i < btns.length; i++) {
		btns[i].onclick = function () {
			btns[i].index = i
			// 滚动样式
			var startPos = window.scrollY
			var targetPos = tops[this.index]

			// 下面的滚动动画可以使用函数分离开
			if (startPos > targetPos) {
				// 向上导航样式
				let timer = setInterval(function () {
					//每隔50ms startPos增加若干像素,直到startPos>=targetPos,则停止
					startPos -= 12
					if (startPos > targetPos) {
						window.scrollTo(0, startPos)
					} else{
						clearInterval(timer)
					}
				},4)
			} else {
				// 向下导航样式
				let timer = setInterval(function () {
					//每隔50ms startPos增加若干像素,直到startPos>=targetPos,则停止
					startPos += 12
					if (startPos < targetPos) {
						window.scrollTo(0, startPos)
					} else{
						clearInterval(timer)
					}
				},4)
			}

			// window.scrollTo(0,tops[this.index])
			// 清空激活样式
			btns.forEach(function (item) {
				item.className = ""
			})
			// 设置激活样式
			btns[i].className = "active"
		}
	}
	function activeFloor(index) {
		btns.forEach(function (item) {
			item.className = ""
		})
		// for (let i = 0; i < btns.length; i++) {
		// 	btns[i].className=""
		// }
		btns[index].className = "active"
	}
	// 在Window对象上注册onscroll事件,该事件会在浏览器上下滚动或者左右滚动时候触发
	window.onscroll = function () {
		// scrollY是网页顶部的坐标
		// console.log(window.scrollY)
		// console.log(ms.offsetTop)
		if(window.scrollY > ms.offsetTop) {
			menu.style.display='block'
		} else {
			menu.style.display="none"
		}
		// 这里存在问题为解决,滚动的时候切换的有点毛病,原因未找到
		if (window.scrollY >= tops[0] && window.scrollY < tops[1]) {
			activeFloor(0)
		} else if (window.scrollY >= tops[1] && window.scrollY > tops[2]) {
			activeFloor(1)
		}else if (window.scrollY >= tops[2] && window.scrollY > tops[3]) {
			activeFloor(2)
		}else if (window.scrollY >= tops[3]) {
			activeFloor(3)
		}
	}
}