import request from "@/utils/request";

// 首页api
export function getHome() {
    return request({
        url:"home/index",
        method:"get",
    });
}