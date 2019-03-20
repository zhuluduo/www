
const DetailUrl= (one,two,tree) => {
    return {
        //运营端
        "101010": {
            "240010": `usercenter/to-quotation?requireId=${one}&quotationId=${two}`, //新需求
            "240020": `order-detail?id=${one}&type=2`, //新订单详情
            "240030": `usercenter/quotation-list?requireId=${one}`, //新报价
            "240040": `main/manufacturer-details?companyId=${one}&status=190010`, //制造商入驻
            "240050": `main/after-detail?id=${one}`, //售后申请(需求方)
            "240080": `main/after-detail?id=${one}`, //运营-退款
            "240500": `main/audit-requirement`, //需求审核
        },
        //用户端
        "101020": {
            "240010": `usercenter/to-quotation?requireId=${one}&quotationId=${two}`, //新需求
            "240020": `order-detail?id=${one}&type=2`, //新订单
            "240030": `usercenter/quotation-list?requireId=${one}`, //新报价
            "240060": `order-detail?id=${one}&type=2`, //退款申请(全公司帐号接收)
            "240060": `order-detail?id=${one}&type=2`, //退款拒绝
            "240080": `order-detail?id=${one}&type=1`, //退款确认
            "240090": `order-detail?id=${one}&type=1`, //订单被拒绝
            "240100": `order-detail?id=${one}&type=1`, //确认接单
            "240200": `order-detail?id=${one}&type=1`, //退款确认
            "240300": `order-detail?id=${one}&type=2`, //确认收货提醒
            "240400": `order-detail?id=${one}&type=1`, //退款完成提醒
            "240500": `usercenter/my-require`, //需求审核不通过
            "240700": {
              'istrue': `usercenter/company-information`, //造商是否通过审核(是)
              'isfalse': `usercenter/company-information-modify`, //造商是否通过审核(否)
            }
        }
    }
}
export default DetailUrl;