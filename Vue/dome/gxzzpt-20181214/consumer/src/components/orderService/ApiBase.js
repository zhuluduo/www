//api访问基类
import request from './request.js'

export default class ApiBase {

    constructor() {
        this.baseUrl = process.env.API_ROOT
    }

    async request(url, data) {
        
        //请求头
        let headers = {
            'Content-Type': 'application/json;charset=utf-8'
        }

        //自动从localStorage获取token
        let userStr = localStorage.getItem('gxzzpt2_consumer') ? localStorage.getItem('gxzzpt2_consumer') : '';
        let user = JSON.parse(userStr)
        if (user && user.token) {
            let token = user.token
            data.token = token
        }

        //参数
        let params = {
            url: this.baseUrl + url,
            method: 'post',
            data: data,
            headers: headers,
        }

        let response = await request(params)
        return response
    }

}
