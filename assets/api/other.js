import service from 'utils/service';
import { stringify } from 'qs';
const otherApi = {
  // 根据条码获取信息
  getProductByBarCode: (barCode) => {
    return service.get(`/source/record/getProductByBarCode?barCode=${barCode}`);
  },
  getUserCompanyList: (userId) => {
    return service.get(`/source/company/getUserCompanyList?userId=${userId}`);
  },
  getCompanyByUniformcode: (params) => {
    return service.post(`/source/company/getCompanyByUniformcode`, params);
  },
  // 获取已激活企业
  getJoinCompanyList: (companyName, uniformCode) => {
    return service.get(
      `/source/company/getCompanyList?companyName=${companyName}&uniformCode=${uniformCode}`
    );
  },
  //字典---获取食品类别列表
  getTypeOfFood: (remark) => {
    return service.get(`/source/productRecord/getTypeOfFood?remark=${remark}`);
  },
  // 根据字典类型获取字典值
  getValue: (params) => {
    return service.get(`/source/dictionary/value/getValue?${stringify(params)}`);
  },
  //获取产地 二级
  getRegionNew: (params) => {
    return service.get(`/source/region/getRegionNew?${stringify(params)}`);
  },
  getUnitListGetValue: (params) => {
    // 单位列表
    return service.get(`/source/dictionary/value/getValue?${stringify(params)}`);
  },
  //  单位新增
  insert: (params) => {
    return service.post(`/source/dictionary/value/insert`, params);
  },
  // 获取计量单位
  getUnitList: (params) => {
    return service.post(`/source/unit/getUnitList`, params);
  },
  // 删除计量单位
  deleteUnit: (params) => {
    return service.post(`/source/unit/deleteUnit`, params);
  },
  // 新增计量单位
  addUnit: (params) => {
    return service.post(`/source/unit/addUnit`, params);
  }
};
export default otherApi;
