import axios from 'axios';
import {getToken,refreshToken} from './desktop';
// import {refreshToken} from './desktop';
import {} from 'motify'


// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_AUTH_API, // api的base_url
    timeout: 5000, // 请求超时时间
});

const errorHandler = (code) => {
    if (code && [401].includes(code)) {
        Message.error('登录已过期，请重新登录');
        // 返回 401 token失效
        refreshToken();
    }

    if (code && [403].includes(code)) {
        // 返回 401 token失效
        refreshToken();
    }

}

// request拦截器
service.interceptors.request.use(
    async (config) => {
        // 在发送请求之前做些什么
        // const token = 'eyJraWQiOiI5ZWQzNmI5ZC02NzIzLTRiZTAtOWU1Mi1mMjM1Mjc4YTYzMDQiLCJhbGciOiJSUzI1NiJ9.eyJzeXNBcmVhIjpmYWxzZSwic3ViIjoiNTg3MzJlMmItNGQ4OS00YzkxLTg3MDktM2ZkMDNmNjJkY2U4IiwiZW1wSWQiOiJhN2FmMTU4Ny0zMWUxLTQyYjktODU5YS05OWY3ZTEzZmU1YTUiLCJyb2xlcyI6WyJST0xFX09SR19DTEVSS1MiLCJST0xFX09SR19IUl9BRE1JTiIsIlJPTEVfT1JHX0hSX1VTRVIiLCJST0xFX09SR19NRUVUSU5HIiwiUk9MRV9PUkdfQURNSU4iLCJST0xFX09SR19NQU5BR0VSIiwiUk9MRV9PUkdfTUVFVElORy1NQU5BR0VSIiwiUk9MRV9PUkdfREVQLUNMRVJLUyIsIlJPTEVfT1JHX1VTRVIiXSwiaXNzIjoiaHR0cHM6XC9cL2F1dGgubW16cW9hLm5ldCIsInN5c09yZyI6ZmFsc2UsInVzZXJJZCI6IjU4NzMyZTJiLTRkODktNGM5MS04NzA5LTNmZDAzZjYyZGNlOCIsImRlcE5hbWUiOiJzeXN0ZW0iLCJvcmdJZCI6ImZkZWM1NWZiLTc1ZTUtNDBjYy1hMTI0LTUzZjY2NDU5MGM0NiIsImF1ZCI6InVzZXI6NTg3MzJlMmItNGQ4OS00YzkxLTg3MDktM2ZkMDNmNjJkY2U4OnRlc3QiLCJuYmYiOjE2NzE3ODE5NDgsImFyZWFJZCI6IjhjODU3YTZhLWY4YTEtNDc4NS05OWY3LTRmZWQwMTE3ZDY0ZSIsInNjb3BlIjpbIm9wZW5pZCJdLCJlbXBOYW1lIjoi6L2m6YeR5oiQIiwic3lzRGVwIjpmYWxzZSwiZGVwSWQiOiI3NDk2MTMwMC0xMWRlLTRlOTMtODliNC04NzE3NGUxNWViN2IiLCJleHAiOjE2NzE3ODM3NDgsImlhdCI6MTY3MTc4MTk0OH0.fWcwHBSk3GAcxAXyijx2QYEv3zQa3XFDyfSRTzKh1zbpL3HhNlGw5ouQhPYaABfmIAaH5atQt3HZJLpoUUQ8o99WUYWDpB0escQ3PMzc1EBayWihzBADrP2GPBoNRqYcP8ZcfR-oJ6GmSPjZ5zjx_5mWmQTXPwaKAZoCqE2gnRijMZX5jl8RBUEqnocA7KoZg1osO-sPZVxEJXp94dZlyyXHGWIMR2vYP6YpSDoztv04HVhavUQAF4YBZv5ZcAns8EBIhyxFtXIZfpDKyMza_QqBPu7JGfefBNXo3kibtD-RaBviONOmIGSgkQx39tiOWo9OpaWwusZf-1F22iwF2A';
        const token = await getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            ...config.headers,
        }
        config.headers = headers;
        return config
    },
    (error) => {
        //Message.error(error);
        Promise.reject(error);
    },
);

// response拦截器
service.interceptors.response.use(
    (response) => {

        if (response.data.error) {
            Message.error(response.data.message);
        }

        return response.data
    },
    (error) => {
        errorHandler(error.response.status)
        //Message.error(error);
        return Promise.reject(error);
    },
);

export default service;
