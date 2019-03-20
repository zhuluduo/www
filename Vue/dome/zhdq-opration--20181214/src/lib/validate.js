export const emailValidator = (rules, value, callback) => {
	console.log(1111);
   let req = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (!req.test(value)) {
        callback(new Error("请输入正确的邮箱"));
    } else {
        callback();
    }
};

export const phoneValidator = (rule, value, callback) => {
    let req = /^((((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})|(0\d{2,3}-\d{7,8}))$/
    if (!req.test(value)) {
        callback(new Error("请输入正确的手机号"));
    } else {
        callback();
    }
};

