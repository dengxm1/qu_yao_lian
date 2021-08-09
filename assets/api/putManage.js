import service from 'utils/service';
import { stringify } from 'qs';
const PutManageApi = {
  // 入库列表
  getOrderList: (params) => {
    return service.post(`/source/order/in/getOrderList`, params);
  },
  // 流通产品入库
  addBuyProductBatchInfo: (params) => {
    return service.post('/out/product/addBuyProductBatchInfo', params);
  },
  // 流通产品待入库 入库接口
  // /source/order/out/orderIn
  outOrderIn: (params) => {
    return service.post('/source/order/out/orderIn', params);
  },
  // 入库详情
  getInRegisterDetail: (params) => {
    return service.post('/out/order/getInRegisterDetail', params);
  },
  // 草稿重新入库
  repairInBuyOrder: (params) => {
    return service.post('/source/repair/repairInBuyOrder', params);
  },
  repairInOrder: (params) => {
    return service.post('/source/repair/repairInOrder', params);
  },
  // 撤销入库
  revokeInOrder: (params) => {
    return service.post('/source/revokeController/revokeInOrder', params);
  },
  // 删除入库订单
  deleteInBuyOrder: (params) => {
    return service.post('/source/repair/deleteInBuyOrder', params);
  },
  // 删除批次记录
  deleteProductBatch: (params) => {
    return service.post('/source/repair/deleteProductBatch', params);
  },
  // 生产产品入库
  addProductBatchInfo: (params) => {
    return service.post('/out/product/addProductBatchInfo', params);
  },
  // 生产企业
  // 生产企业撤销、草稿重新入库
  updateProductBatchInfo: (params) => {
    return service.post('/out/product/updateProductBatchInfo', params);
  },
  // 新增的流通产品编辑
  updateBuyProductBatchInfo: (params) => {
    return service.post('/out/product/updateBuyProductBatchInfo', params);
  },
  // 生产产品入库详情
  getInProduceDetail: (params) => {
    return service.post('/out/order/getInProduceDetail', params);
  },
  // 生产产品模板下载
  downloadProductRegistrationModel: () => {
    return service({
      url: `/out/product/downloadProductRegistrationModel`,
      method: 'post',
      type: 'application/vnd.ms-excel',
      responseType: 'blob'
    });
  },
  // 生产产品导入
  uploadProductRegistrationModel: (params) => {
    return service.post('/out/product/uploadProductRegistrationModel', params);
  },
  // 流通产品模板下载
  downloadCirculationModel: () => {
    return service({
      url: `/out/product/downloadCirculationModel`,
      method: 'post',
      type: 'application/vnd.ms-excel',
      responseType: 'blob'
    });
  },
  // 流通产品导入
  uploadCirculationModel: (params) => {
    return service.post('/out/product/uploadCirculationModel', params);
  },
  // 原料模板下载
  downloadCirculationRawModel: () => {
    return service({
      url: `/out/product/downloadCirculationRawModel`,
      method: 'post',
      type: 'application/vnd.ms-excel',
      responseType: 'blob'
    });
  },
  // 物料入库导入
  uploadCirculationRawModel: (params) => {
    return service.post('/out/product/uploadCirculationRawModel', params);
  },

  // 文件上传
  upload: (params) => {
    return service.post('/source/resouce/upload', params);
  },
  // 文件列表
  fileList: (params) => {
    return service.get(`/source/resouce/fileList?${stringify(params)}`);
  },
  // 新增或者修改批批检测报告
  addOrUpdateTestBase: (params) => {
    return service.post('/out/product/addOrUpdateTestBase', params);
  },
  // 获取原料批次信息
  selectRawBatch: (params) => {
    return service.post('/out/product/selectRawBatch', params);
  },
  // 待入库列表
  pendingOrderList: (params) => {
    return service.post('/out/product/pendingOrderList', params);
  },
  // 确认入库
  confirmStorage: (params) => {
    return service.post('/out/product/confirmStorage', params);
  },
  // 生成检验报告
  generateTestReport: (params) => {
    return service.post('/out/product/generateTestReport', params);
  },
  // 查看检验报告
  getTestReport: (params) => {
    return service.get(`/out/product/getTestReport?${stringify(params)}`);
  },
  // 从业人员列表
  practitionersList: (params) => {
    return service.post('/source/practitionersRecord/practitionersList', params);
  },
  // 从业人员新增
  practitionersAdd: (params) => {
    return service.post('/source/practitionersRecord/practitionersAdd', params);
  },
  // 从业人员删除
  practitionersDelete: (params) => {
    return service.post('/source/practitionersRecord/practitionersDelete', params);
  },
  // 从业人员详情
  practitionersDetail: (params) => {
    return service.post('/source/practitionersRecord/practitionersDetail', params);
  },
  // 从业人员修改
  practitionersUpdate: (params) => {
    return service.post('/source/practitionersRecord/practitionersUpdate', params);
  },
  // 检验人员列表
  inspectorList: (params) => {
    return service.post('/source/inspector/inspectorList', params);
  },
  // 检验人员新增
  inspectorAdd: (params) => {
    return service.post('/source/inspector/inspectorAdd', params);
  },
  // 流通凭证上传与编辑
  updateCirculationCertificate: (params) => {
    return service.post('/source/circulationCertificate/updateCirculationCertificate', params);
  }
};
export default PutManageApi;
