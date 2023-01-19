import axios from "axios";

const service = axios.create({
    baseURL:"https://api.boychai.xyz",
    timeout: 5000,
});

export default service;