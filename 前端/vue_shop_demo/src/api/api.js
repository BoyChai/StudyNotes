import request from "@/utils/request";

// 首页api
export function getHome() {
    return request({
        url:"home/index",
        method:"get",
    });
}

//分类api
export function getCategory(){
    return request({
        url:"category/index",
        method:"get",
    });
}
export function getCurrentCategory(id){
    return request({
        url:"category/info",
        method:"get",
        data: {
            id: id
        },
    })
}

// 购物车
export function getCart(){
    return request({
        url:"cart/index",
        method:"get",
    })
}

//登录
export function login(user) {
    return request({
        url:"login",
        method:"post",
        data:user
    })
}