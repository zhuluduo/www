import ApiBase from './ApiBase'
import { isWechatBrowser } from '../common/common'
import router from '../router'

export default class LoginService extends ApiBase {
    //登陆
    async login(username, password, userType = 101020) {
       
        const url = '/login'
        let data = {username, password, userType} // 初始化请求参数
        const result = await super.request(url, data)

        //保存到localStorage
        if (result.code == 200) {
            this.setCache('gxzzpt2_mobile', JSON.stringify(result.data))
        }

        return result
    }

    //退出
    async exit() {
        let result = await super.request('/exit?from=mobile');
        if (result.code == 200 ) {
            localStorage.setItem('gxzzpt2_mobile', '');
        }
        return result;
    }

    loginSuccessHandler(routerPath) {
        if (isWechatBrowser()) {
            let rootApi = process.env.API_ROOT;
            let rootClient = process.env.CLIENT_ROOT;
            let redirectApi = encodeURIComponent(`${rootApi}/getWeChatCode`);
            let redirectUri = encodeURIComponent(`${rootClient}/mobile/#${routerPath}`);
            let fullUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx32aa0ee4fe7e8e6e&redirect_uri=${redirectApi}&response_type=code&scope=snsapi_base&state=${redirectUri}`;
            window.location.href = fullUrl;
        } else {
            router.push({ path: routerPath });
        }
    }

    //微信登录与绑定
    async loginByWechat( code ) {
        const result = await super.request('/loginByWeChat', {code});
        return result;
    }
}
