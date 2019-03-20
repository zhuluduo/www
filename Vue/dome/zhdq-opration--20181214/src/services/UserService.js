import ApiBase from './ApiBase'

export default class UserService extends ApiBase {

    //登陆
    async login(username, password) {

        const url = '/user/login'
        let data = {username, password}
        const result = await super.request(url, data)

        //保存到localStorage
        if (result.code == 200) {
            this.setCache('user_info', JSON.stringify(result.data))
        }

        return result
    }

    //获取用户列表
    async getList(pageSize, pageIndex, sex, state) {
        let result = await super.request('/user_manage/query_list', {sex: sex, state: state, page_size: pageSize, page_index: pageIndex});
        return result;
    }

    //修改手机号
    async modifyPhone(oldPhone, newPhone) {
        let result = await super.request('/user_manage/modify_user_phone', {oldphone:oldPhone, newphone: newPhone});
        return result;
    }

    //修改密码
    async modifyPassword(phone, newPassword) {
        let result = await super.request('/user_manage/modify_user_passwd', {phone:phone, newpasswd: newPassword});
        return result;
    }

    //修改状态
    async modifyState(phone, state) {
        let result = await super.request('/user_manage/modify_user_state', {phone:phone, state: state});
        return result;
    }

    //退出
    async exit() {
        this.setCache('user_info', '{}')
    }

}
