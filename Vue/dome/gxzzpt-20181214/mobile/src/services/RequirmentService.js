import ApiBase from './ApiBase'

export default class RequirmentService extends ApiBase {
    
    /*
    @params pageIndex 当前页
    @params pageSize每页条数
    */
    async InquiriesList(params) {
        let url='/custom/requirement/getLastestEnquiry'
        const result = await super.request(url, params)
        return result
    }

    /*
    询盘详情
    @params id 
    */
    async EnquiryDetails(params){
        let url='/custom/requirement/getEnquiry'
        const result = await super.request(url, params)
        return result 
    }
    
    /*
    供应商
    @params keyword  搜索
    @params industryIds  行业Id
    @params techniqueTypeList  工艺Id
    */
    async Supplier(params){
        let url='/getManufacturerList'
        const result = await super.request(url, params)
        return result 
    }

    /*
    供应商详情
    @params companyId  id
    */
   async Supplierdetails(params){
    let url='/custom/company/getCompanyDetail'
    const result = await super.request(url, params)
    return result 
   }

    /*
    产品库
    @params keyword  搜索
    @params industryIds  行业Id
    @params techniqueTypeList  工艺Id
    */
   async Product(params){
    let url='/custom/productCase/list'
    const result = await super.request(url, params)
    return result 
}

    /*
    产品库详情
    @params id
    */
    async Productdetails(params){
    let url='/custom/productCase/get'
    const result = await super.request(url, params)
    return result 
    }
}
