// 读取token
let tokenName = "Mail-Token"
export function getToken() {
    return window.sessionStorage.getItem(tokenName);
}
export function setToken(token) {
    return window.sessionStorage.setItem(tokenName,token)
}