import axios from 'axios'
import {getToken} from '@/utils/token'

const service = axios.create({
    baseURL: 'http://api.boychai.xyz/admin',
    timeout: 5000
});
let tokenHeaderName = "Mall-Token";
//请求拦截器
service.interceptors.request.use(config => {
    //统一添加token(请求头)
    let token = getToken();
    config.headers[tokenHeaderName] = token;
    return config;
}, err => Promise.reject(err));


export default service;
