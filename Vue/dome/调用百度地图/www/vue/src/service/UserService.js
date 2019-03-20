import { ApiService } from './ApiService.js'

/**
 * 用户服务类
 */
export default class UserService extends ApiService {

  //登陆
  async login(username, password) {
    var result = false

    const url = '/login'
    let data = {username, passworde} // 初始化请求参数

    const json = await super.request({ url, data })
    
    if (json.code === '200') { // 登录成功，存储用户令牌
      super.setCache('token', json.data.token)
      super.setCache('username', json.data.username)
      result = true
    }
    return result
  }


}
