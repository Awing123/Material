import {getToken} from './desktop';

import Store from "../store/index";



const requestError = (text, timeOut) => {
    window.error(text, timeOut);
    Store.$emit('request_error');
}


const get_options = async (method, params) => {
    let new_methods = ['GET', 'POST', 'PUT', 'DELETE'];

    let no_body_methods = ['GET', 'DELETE'];

    let is_new_method = new_methods.indexOf(method) >= 0;

    let is_no_body_method = no_body_methods.indexOf(method) >= 0;

    // let userAccessToken = 'eyJraWQiOiI5ZWQzNmI5ZC02NzIzLTRiZTAtOWU1Mi1mMjM1Mjc4YTYzMDQiLCJhbGciOiJSUzI1NiJ9.eyJzeXNBcmVhIjpmYWxzZSwic3ViIjoiNTg3MzJlMmItNGQ4OS00YzkxLTg3MDktM2ZkMDNmNjJkY2U4IiwiZW1wSWQiOiJhN2FmMTU4Ny0zMWUxLTQyYjktODU5YS05OWY3ZTEzZmU1YTUiLCJyb2xlcyI6WyJST0xFX09SR19DTEVSS1MiLCJST0xFX09SR19IUl9BRE1JTiIsIlJPTEVfT1JHX0hSX1VTRVIiLCJST0xFX09SR19NRUVUSU5HIiwiUk9MRV9PUkdfQURNSU4iLCJST0xFX09SR19NQU5BR0VSIiwiUk9MRV9PUkdfTUVFVElORy1NQU5BR0VSIiwiUk9MRV9PUkdfREVQLUNMRVJLUyIsIlJPTEVfT1JHX1VTRVIiXSwiaXNzIjoiaHR0cHM6XC9cL2F1dGgubW16cW9hLm5ldCIsInN5c09yZyI6ZmFsc2UsInVzZXJJZCI6IjU4NzMyZTJiLTRkODktNGM5MS04NzA5LTNmZDAzZjYyZGNlOCIsImRlcE5hbWUiOiJzeXN0ZW0iLCJvcmdJZCI6ImZkZWM1NWZiLTc1ZTUtNDBjYy1hMTI0LTUzZjY2NDU5MGM0NiIsImF1ZCI6InVzZXI6NTg3MzJlMmItNGQ4OS00YzkxLTg3MDktM2ZkMDNmNjJkY2U4OnRlc3QiLCJuYmYiOjE2NzE3ODE5NDgsImFyZWFJZCI6IjhjODU3YTZhLWY4YTEtNDc4NS05OWY3LTRmZWQwMTE3ZDY0ZSIsInNjb3BlIjpbIm9wZW5pZCJdLCJlbXBOYW1lIjoi6L2m6YeR5oiQIiwic3lzRGVwIjpmYWxzZSwiZGVwSWQiOiI3NDk2MTMwMC0xMWRlLTRlOTMtODliNC04NzE3NGUxNWViN2IiLCJleHAiOjE2NzE3ODM3NDgsImlhdCI6MTY3MTc4MTk0OH0.fWcwHBSk3GAcxAXyijx2QYEv3zQa3XFDyfSRTzKh1zbpL3HhNlGw5ouQhPYaABfmIAaH5atQt3HZJLpoUUQ8o99WUYWDpB0escQ3PMzc1EBayWihzBADrP2GPBoNRqYcP8ZcfR-oJ6GmSPjZ5zjx_5mWmQTXPwaKAZoCqE2gnRijMZX5jl8RBUEqnocA7KoZg1osO-sPZVxEJXp94dZlyyXHGWIMR2vYP6YpSDoztv04HVhavUQAF4YBZv5ZcAns8EBIhyxFtXIZfpDKyMza_QqBPu7JGfefBNXo3kibtD-RaBviONOmIGSgkQx39tiOWo9OpaWwusZf-1F22iwF2A';
    let userAccessToken = await getToken();

    // 构建options
    let options = {
        headers: {
            Authorization: `Bearer ${userAccessToken}`
        }
    }

    // 新的请求格式为json提交参数
    if (is_new_method) options.headers["Content-Type"] = "application/json";

    options.method = is_new_method ? method : method == "UPLOAD" ? "POST" : "GET";

    if (!is_no_body_method && params) {
        let format_params = null;
        if (is_new_method)
            format_params = JSON.stringify(params)
        else if (method == 'UPLOAD') {
            format_params = new FormData()
            Object.keys(params).forEach(key => format_params.append(key, params[key]))
        }
        options.body = format_params
    }

    if (method == 'DOWNLOAD') {
        options.responseType = 'blob'
    }

    return options
}

export const request = {
    request: (url, method, params, closeLoading) => {
        return new Promise(async (resolve) => {
            window.loading(closeLoading);

            // 获取options
            let options = await get_options(method, params);
            console.log('options', options)
            const baseUrl = process.env.VUE_APP_BASE_API
            console.log(baseUrl)
            fetch( baseUrl + url, options).then(res => {
                console.log('fetch_then请求结果', res)
                if (!res.ok) throw Error(res.status)
                return method == 'DOWNLOAD' ? res.blob() : res.json()
            }).then(res => {
                console.log('request请求结果', res)

                window.loaded(closeLoading);

                if (!res) {
                    requestError('返回结果为空！')
                    return;
                }
                if (res.error) {
                    requestError(res.message || '请求出错！')
                    return;
                }
                if (res.result && res.result != 1) {
                    requestError(res.info || '请求出错！')
                    return;
                }

                resolve(res);
            }).catch(res => {
                console.log('fetch_catch', res.message)
                window.loaded(closeLoading);
                if (res.message == '403') {
                    requestError('未登录或无权限！');
                    return
                }
                requestError('网络错误！' + res.message);
            })
        })
    },
    download_action: (apiUrl, fileName) => {
        return new Promise(resolve => {
            //window.info('附件下载中，请稍待。。。')
            if (window.top.desktop) {
                request.request(apiUrl, 'DOWNLOAD').then(res => {
                    let a = document.createElement('a');
                    let url = window.URL.createObjectURL(res);
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    resolve(res);
                })
            }
            // 手机下载文件
            else {
                let url = `https://${document.domain=='myoa.mmzqoa.net'?document.domain:'imyoa.mmzqoa.net:30443'}${apiUrl}`
                window.loading()
                window.top.client.downloadFileStream(url).then(res => {
                    console.log(res);
                    window.loaded();
                    resolve('手机下载' + url);
                });
            }
        })
    },

    delete: (url) => {
        return new Promise(resolve => {
            request.request(url, 'DELETE').then(res => resolve(res))
        })
    },
    upload: (url, params) => {
        return new Promise(resolve => {
            request.request(url, 'UPLOAD', params).then(res => resolve(res))
        })
    },
    downloadNew: (url) => {
        return new Promise(resolve => {
            let apiUrl = "/resources/org-user/v1/download?url=" + url;
            let fileName = url.substring(url.lastIndexOf('/') + 1, url.length)
            request.download_action(apiUrl, fileName).then(res => resolve(res))
        })
    },
}
