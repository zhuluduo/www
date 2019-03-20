import request from '../common/request.js'
import Router from '../router/routes'
import { Loading } from 'element-ui'

//通过环境配置相应的接口请求地址
//var baseURL = process.env.API_ROOT

/**
 * 接口服务基类
 */
export class ApiService {

  /**
   * [初始化接口服务]
   * @return {[Object]} [description]
   */
  constructor() {
    this.cache = window.lscache // 接口缓存对象
    this.apiURL = '' // 接口地址
  }

  /**
   * [设置数据缓存]
   * @param {String} cacheKey  [缓存唯一标识字符串，如果为空则忽略]
   * @param {[Any]} cacheVal   [缓存数据，如果为空则忽略]
   * @param {[Int]} cacheTime  [缓存时间，默认存储30天；若设置的值小于等于0，则立即清除该缓存]
   * @return {[Boolean]}       [如果设置成功则返回 True，否则返回 False]
   */
  setCache(cacheKey = null, cacheVal = null, cacheTime = 60 * 24 * 30) {
    if (!cacheKey || !cacheVal || !this.cache) return false
    return this.cache.set(cacheKey, cacheVal, cacheTime)
  }

  /**
   * [获取缓存数据]
   * @param  {[String]} cacheKey [缓存唯一标识字符串]
   * @return {[Any]}             [返回该缓存标识对应的缓存数据]
   */
  getCache(cacheKey = null) {
    if (!cacheKey || !this.cache) return void 0
    return this.cache.get(cacheKey) || {}
  }

  /**
   * [发送AJAX请求]
   * @param  {[type]} params [description]
   * @return {[type]}      [description]
   */
  async request(params) {

    // 对 URL 进行处理
    params.url = this.apiURL + params.url
    params.method = 'post'
    params.contentType = ''

    // 显示加载中。。
    let loading = Loading.service({ fullscreen: true, text: '加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.8)' })
    const response = await request(params)
    
    if (response.code=='200') {
      window.lscache.set('token', '')
      window.lscache.set('name', '')
      Router.push('/login')
    }
    
    setTimeout(() => {
      loading.close();
    }, 200);

    return response
  }

}
