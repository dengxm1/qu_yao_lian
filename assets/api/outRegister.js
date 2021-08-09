import service from 'utils/service';
import { stringify } from 'qs';
const outApi = {
  addOutStackInfo: (params) => {
    return service.post('/source/order/out/insert', params);
  },
  getOutRegister: (params) => {
    return service.post('/out/order/getOutRegister', params);
  },
  getOrderList: (params) => {
    return service.post('/source/order/in/getOrderList', params);
  },
  // 根据企业id获取产品列表
  getProductList: (params) => {
    return service.post('/source/order/out/getProductList', params);
  },
  // 根据产品id获取批次列表
  getProductBatchList: (params) => {
    return service.post('/source/order/out/getProductBatchList', params);
  },
  // 出库详情
  getOutRegisterDetail: (params) => {
    return service.post('/out/order/getOutRegisterDetail', params);
  },
  // 所有下游企业
  allCompany: (params) => {
    return service.post('/repair/allCompany', params);
  },
  // 撤销出库
  revokeOutOrder: (params) => {
    return service.post('/source/revokeController/revokeOutOrder', params);
  },
  // 出库重新入库
  repairOutOrder: (params) => {
    return service.post('/source/repair/repairOutOrder', params);
  },
  // 删除出库
  deleteOutOrder: (params) => {
    return service.post('/source/repair/deleteOutOrder', params);
  },
  // 出库模板下载
  downloadOutOrderModel: () => {
    return service({
      url: `/source/order/out/downloadOutOrderModel`,
      method: 'post',
      type: 'application/vnd.ms-excel',
      responseType: 'blob'
    });
  },
  // 批量导入
  uploadOutOrderModel: (params) => {
    return service.post('/source/order/out/uploadOutOrderModel', params);
  },
  // 编辑出库
  updateBuyProductBatchInfo: (params) => {
    return service.post('/source/order/out/updateBuyProductBatchInfo', params);
  }
};
export default outApi;
