import request from '../common/request.js'
import { Indicator } from 'mint-ui'

//api访问基类，所有网络请求都应该继承ApiBase这个类
export default class ApiBase {
    //构造函数,系统调用
    constructor() {
        this.baseUrl = process.env.API_ROOT
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

    //所有的网络请求都通过这个方法出去
    async request(url, data = {}) {

        let headers = {
            'Content-Type': 'application/json;charset=utf-8'
        }

        let userStr = this.getCache('gxzzpt2_mobile') ? this.getCache('gxzzpt2_mobile') : '{}';
        let user = JSON.parse(userStr)

        if (user && user.token) {
            data.token = user.token
        }

        let params = {
            url: this.baseUrl + url,
            method: 'post',
            data: JSON.stringify(data),
            headers: headers,
        }

        //弹菊花
        Indicator.open({
            text: '加载中...',
            spinnerType: 'triple-bounce'
        });
        setTimeout(() => Indicator.close(), 2000)

        //请求网络
        let response = await request(params)
        let resData = response.data

        if (resData.code == 400) {
            window.$vm.$router.push('/login')
        }

        //关菊花
        Indicator.close()
        return resData
    }

    //不带token，不加url前缀的请求访问，用于请求外部接口
    async rawRequest(url, method='get', data = {}) {

        let headers = {
            'Content-Type': 'application/json;charset=utf-8'
        }

        let params = {
            url: url,
            method: method,
            data: JSON.stringify(data),
            headers: headers,
        }

        //弹菊花
        Indicator.open({
            text: '加载中...',
            spinnerType: 'triple-bounce'
        });
        setTimeout(() => Indicator.close(), 2000)

        //请求网络
        let response = await request(params)
        let resData = response.data

        //关菊花
        Indicator.close()
        return resData
    }

    //上传文件接口
    async Upload(url,data='') {

        let headers = {
            'Content-Type': 'multipart/form-data'
        }
        let params = {
            url: url,
            method: 'post',
            data: data,
            headers: headers,
        }
        //请求网络
        let response = await request(params)

        let resData = response.data
        
        return resData
    }

}
