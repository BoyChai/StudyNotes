// 格式化数字,输入1返回1.00
export function priceFormat(price) {
    if(isNaN(price)) {
        return null;
    }
    let f = parseFloat(price)
    f = Math.round(price*100) / 100
    let s = f.toString();
    let rs = s.indexOf(".")
    if (rs < 0 ){
        rs=s.length
        s += ".";
    }
    while (s.length <= rs+2) {
        s+='0'
    }
    return s
}