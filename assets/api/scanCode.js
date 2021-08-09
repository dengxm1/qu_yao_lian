import service from 'utils/service';
import { stringify } from 'qs';

const outApi = {
  getDeatil: (params) => {
    return service.get(`/scan/source/order/in/gtin/${params.gtin}/bat/${params.bat}`);
  },
  getDeatilNoBat: (params) => {
    return service.get(`/scan/source/order/in/gtin/${params.gtin}`);
  },
  // 选择批次
  selectProductBatch: (params) => {
    return service.post(`/scan/source/order/in/selectProductBatch`, params);
  },
  // 获取短连接数据
  getTraceNumber: (params) => {
    return service.get(`/scan/source/order/in/${params.traceNumber}`);
  },
  //
  getProductTraceInfo: (productDetailId) => {
    return service.get(
      `/scan/source/order/in/getProductTraceInfo/?productDetailId=${productDetailId}`
    );
  },
  // 获取品类码扫码获取企业列表
  getCodePageInfoCompanyList: (params) => {
    return service.get(`/source/order/in/getCodePageInfoCompanyList?${stringify(params)}`);
  },
  // 根据企业id和条码查询品类码信息
  getCodePageInfoAll: (params) => {
    return service.get(`/source/order/in/getCodePageInfoAll?${stringify(params)}`);
  }
};
export default outApi;
