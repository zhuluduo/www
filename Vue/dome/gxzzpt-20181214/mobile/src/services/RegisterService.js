import ApiBase from './ApiBase'

export default class RegisterService extends ApiBase {
    //登陆
    async register( params ) {

        const url = '/custom/user/register'
        const result = await super.request(url, params)

        return result
    }

}