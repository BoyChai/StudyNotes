import request from '@/utils/request'
//商品列表
export function getGoodsList(queryParam){
    return request({
        url: "goods/list",
        method: "get",
        data: {queryParam}
    });
}

export function getBrandAndCategory(){
    return request({
        url: "goods/catAndBrand",
        method: "get"
    });
}