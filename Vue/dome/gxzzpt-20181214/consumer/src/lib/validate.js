
//element表单自定义验证模块；

//必填信息；
export const checkNormal = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('信息不能为空'));
    } else {
        callback();
    }
};
//验证文件是否上传；
export const validateFile = (rule, value, callback) => {
    if (value.length <= 0) {
        callback(new Error("请上传文件"));
    } else {
        callback();
    }
};
//验证电话号码
export const validatePhone = (rule, value, callback) => {
    let req = /^((((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})|(0\d{2,3}-\d{7,8}))$/
    if (!req.test(value)) {
        callback(new Error("请输入正确的手机号"));
    } else {
        callback();
    }
};
//验证电话号码
export const validatePhone2 = (rule, value, callback) => {
    let req = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+[0-9*]{8})$/
    if (!req.test(value)) {
        callback(new Error("请输入正确的手机号"));
    } else {
        callback();
    }
};
//验证传真；
export const validateFax = (rule, value, callback) => {
  let req = /^(0\d{2,3}-\d{7,8})$/
  if (!req.test(value)) {
    callback(new Error("请输入正确的传真号"));
  } else {
    callback();
  }
};
//验证验证码
export const validatePhoneCode = (rule, value, callback) => {
  let req = /^(\d{4})$/;
  if (!req.test(value)) {
    callback(new Error("请输入正确的验证码"));
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

//账号 英文字母加数字
export const validatAaccount = (rule, value, callback) => {
    let req = /^[_-zA-Z0-9.@-]{4,36}$/;
    if (!req.test(value)) {
        callback(new Error("请输入正确的账号"));
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
//邮箱补全方法；
export const EmailAuto = (value, callback) => {
    let req = /^[A-Za-z0-9-_@]+$/;
    let results = [];
    if (req.test(value)) {
        var length = (value.match(/@/g) || []).length;
        if (length <= 0) {
            results = [{
                value: value + '@163.com'
            }, {
                value: value + '@qq.com'
            }, {
                value: value + '@sina.com'
            }];
        } else if (length == 1) {
            if (value.endsWith('@')) {
                results = [{
                value: value + '163.com'
                }, {
                value: value + 'qq.com'
                }, {
                value: value + 'sina.com'
                }];
            }
        } else {
            
        }
    }else{
       results = []
    }
    callback(results);
};

