import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';
const stockManageApi = {
  pageForStockIn: (params) => {
    // return service.get(`/source/report/out/toInPage?${stringify(params)}`);
    return service.get(`/source/order/out/waitIn?${stringify(params)}`); // 待入库分页
  },
  confirmStockIn: (params) => {
    // return service.get(`/source/report/out/reportOut?${stringify(params)}`);
    // return service.get(`/source/report/out/reportIn?${stringify(params)}`);
    return service.get(`/source/order/out/orderIn?${stringify(params)}`); // 确认入库
  },
  pageForStockOut: (params) => {
    return service.get(`/source/order/in/list?${stringify(params)}`); // 产品出库列表页
  },
  reportOut: (params) => {
    return service.post('/source/order/out/insert', params); // 产品出库--操作
  },
  pageHaveStockOut: (params) => {
    return service.get(`/source/report/out/outPage?${stringify(params)}`); // 下载码列表
  },
  exportExcel: (params) => {
    return fileService.get(`/source/report/out/exportExcel?${stringify(params)}`); // 下载码
  },
  exportExcelUrl: '/api/source/report/out/exportExcel', // 下载码
  exportEmpty: (params) => {
    return service.get(`/source/report/out/exportEmpty?${stringify(params)}`); // 领取空码
  },
  exportEmptyUrl: '/api/source/report/out/exportEmpty',
  getCompanyList: (params) => {
    return service.get(`/source/user/getCompanyList?${stringify(params)}`); // 获取工商企业信息
  },
  dictionaryList: (params) => {
    return service.get(`/source/dictionary/value/page?${stringify(params)}`); // 获取输出国家和地区
  },
  waitStockIn: (params) => {
    // return service.get(`/source/stock/waitStockIn?${stringify(params)}`);
    return service.get(`/source/order/code/waitStockInCode?${stringify(params)}`); // 待扫码入库分页
  },
  oftenCompanyList: (params) => {
    return service.get(`/source/user/oftenCompanyList?${stringify(params)}`); // 常用联系人列表
  },
  // selectSocialOrg: (params) => {
  //   return service.get(`/source/user/selectSocialOrg?${stringify(params)}`); // 其他社会组织列表数据
  // },
  getSocialOrg: (params) => {
    return service.post('/source/user/getSocialOrg', params); // 其他社会组织列表数据
  },

  queryStockList: (params) => {
    return service.post('/source/stock/queryStockList', params); // 查询库存列表
  },
  queryStockRecord: (params) => {
    return service.get(`/source/stock/queryStockRecord?${stringify(params)}`); // 查询库存列表--出入库记录
  },
  updateStock: (params) => {
    return service.post('/source/stock/updateStock', params); // 查询库存列表--自用损耗
  },
  weightThreshold: (params) => {
    return service.get(`/source/dictionary/value/weightThreshold?${stringify(params)}`); // 获取 入库，出库，报检重量 不能超过的最大值--字典
  },
  productTypeList: (params) => {
    return service.get(`/source/stock/productTypeList?${stringify(params)}`); // 库存管理--产品类别区分库存列表
  },
  checkList: (params) => {
    return service.get(`/source/stock/check/list?${stringify(params)}`); // 库存管理--库存调整单列表
  },
  getStockByProductType: (params) => {
    return service.post('/source/stock/getStockByProductType', params); // 库存管理--产品区分库存列表
  },
  checkDetail: (params) => {
    return service.get(`/source/stock/check/detail?${stringify(params)}`); // 库存管理--库存调整单明细
  },
  checkAdd: (params) => {
    return service.post('/source/stock/check/add', params); // 库存管理--新增库存调整
  },
  getPortList: (params) => {
    return service.get(`/source/report/code/getPortList?${stringify(params)}`); // 获取入境口岸数据
  },
  epMoversList: (params) => {
    return service.get(`/source/order/epMovers/list?${stringify(params)}`); // 获取搬运人员列表
  },
  coldStorageList: (params) => {
    return service.get(`/source/coldStorage/list?${stringify(params)}`); // 获取冷库名称
  }
};
export default stockManageApi;
