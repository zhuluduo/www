//api访问基类
import request from '../common/request.js'

export default class ApiBase {

    constructor() {
        this.apiBaseUrl = 'http://192.168.1.160:5200'
    }

    /*
    保存到缓存，这里重新封装的好处是
    以后可替换成其他方式保存
    */
    setCache(key, value) {
        localStorage.setItem(key, value)
    }

    //得到缓存
    getCache(key) {
        return localStorage.getItem(key)
    }

    //清除缓存
    clearCache(key) {
        localStorage.setItem(key, "");
    }
    
    async request(url, data = {}) {
        
        let headers = {
            'Content-Type': 'application/json;charset=utf-8'
        }

        let userStr = this.getCache('user_info') ? this.getCache('user_info') : '{}'
        let user = JSON.parse(userStr)
        
        data.token = user.token;

        let params = {
            url: this.apiBaseUrl + url,
            method: 'post',
            data: data,
            headers: headers,
        }

        let result
        let response = await request(params)
        result = response.data

        if ( result.code == 600 ) {
            window.$vm.$router.push({path:'/login'});
        }

        return result
    }

}
