import axios from "axios";

const service = axios.create({
    baseURL:"https://api.boychai.xyz/v1",
    timeout: 5000,
});

export default service;