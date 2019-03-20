import ApiBase from './ApiBase'
export default class CommonService extends ApiBase {
    async getWords() {
        let url = '/getWords';
        const result = await super.request(url);
        if (result.code == 200) {
            this.setCache('gxzzpt2_mobile_words', JSON.stringify(result.data))
        }
        return result;
    }

    /*
    @params phone 手机号
    */
    async getCode(params ) {
        let url = '/sendSmsCode';
        const result = await super.request(url, params);
        return result;
    }

    /*
    @params username 手机号/邮箱
    */
    async checkUserExist( params ) {
        let url = '/checkUserExist';
        const result = await super.request(url, params );
        return result;
    }

    /*
    @params url 上传地址;
    */
    async UploadFile(fileUrl, params) {
        let url = fileUrl;
        const result = await super.Upload(url,params);
        return result;
    }
    
    //是否完善资料，是否可报价
    async isQuote() {
        const result = await super.request('/custom/manufacturer/requirement/isQuote');
        return result;
    }

    //获取微信签名
    async getSignature( url ) {
        const result = await super.request('/weChat/getSign',{url});
        return result;
    }
}