import ApiBase from './ApiBase'
export default class CompanyService extends ApiBase {

  //获取行业列表；  
  async getTechnologyList(params) {
    let url = '/custom/Industry/all';
    let data = params ? params:{};
    const result = await super.request(url,data);
    return result;
  }

  //获取公司列表；
  async getCompanyList(params) {
    let url = '/custom/company/getUpdateTemplate';
    let data = params ? params:{};
    const result = await super.request(url,data);
    return result;
  }

  /*获取工艺名称列表
  @params techniquePurpose 工艺用途（ 自动报价460010， 人工报价460020）
  */
  async getTechNameList(params) {
    let url = '/custom/technique/getList';
    let data = params ? params:{};
    const result = await super.request(url,data);
    return result;
  }
  //保存公司数据
  async SaveCompanyData(params) {
    let url = '/custom/company/updateMoreInfo';
    let data = params ? params:{};
    const result = await super.request(url,data);
    return result;
  }
}