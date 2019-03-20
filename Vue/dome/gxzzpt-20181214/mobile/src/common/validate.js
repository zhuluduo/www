//验证电话号码
export const validatePhone = (rule, value, callback) => {
    let req = /^((((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})|(0\d{2,3}-\d{7,8}))$/
    if (!req.test(value)) {
        callback(new Error("请输入正确的手机号"));
    } else {
        callback();
    }
};

//密码验证（长度必须大于6）
export const validatPassword = (rule, value, callback) => {
    let req = /^[_-zA-Z0-9@*&^$.]{6,20}$/;
    if (!req.test(value)) {
        return callback(new Error('请输入6-20位的密码'));
    } else {
        callback();
    }
};

//验证数字;
export const validatNumber = (rule, value, callback) => {
    let req = /^[0-9]+$/;
    if (!req.test(value)) {
        return callback(new Error('请输入数字'));
    } else {
        callback();
    }
};

//验证邮箱；
export const validateEmail = (rule, value, callback) => {
    let req = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (!req.test(value)) {
        callback(new Error("请输入正确的邮箱"));
    } else {
        callback();
    }
};

//验证码
export const validateCode = (rule, value, callback) => {
    let req = /^(\d{4})$/;
    if (!req.test(value)) {
        callback(new Error("请输入正确的验证码"));
    } else {
        callback();
    }
};