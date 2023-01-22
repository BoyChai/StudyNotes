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
    })
}