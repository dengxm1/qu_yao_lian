import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';
const codeManageApi = {
  insert: (params) => {
    return service.post('/source/order/in/insert', params); //产品入库页面--产品入库操作
  },
  inUpdate: (params) => {
    return service.post('/source/order/in/updateInOder', params); //产品出库--修改操作
  },

  codePage: (params) => {
    return service.get(`/source/apply/record/pageCode?${stringify(params)}`); //领取空码--查看详情
  },
  outOrderCode: (params) => {
    return service.get(`/source/order/code/outOrderCode?${stringify(params)}`); //下载上链码--查看详情
  },

  getWaitStockInCode: (params) => {
    return service.get(`/source/apply/record/getWaitStockInCode?${stringify(params)}`);
  },

  page: (params) => {
    return service.get(`/source/order/code/outOrder?${stringify(params)}`); // 下载上链码--列表数据
    //return service.get(`/source/report/out/outPage?${stringify(params)}`); // 下载上链码
  },
  totalWeight: (params) => {
    return service.get(`/source/report/code/totalWeight?${stringify(params)}`); // 查看产品--可入库的数量和重量
  },

  exportExcel: (params) => {
    return fileService.get(`/source/order/code/out/exportExcel?${stringify(params)}`); // 下载上链码--操作
    //return fileService.get(`/source/report/out/exportExcel?${stringify(params)}`); // 下载上链码
  },
  downloadExcel: (params) => {
    return service.get(`/source/apply/record/exportExcel?${stringify(params)}`);
  },
  downloadExcelUrl: '/api/source/apply/record/exportExcel',
  downloadCode: (params) => {
    return service.get(`/source/apply/record/downloadCode?${stringify(params)}`);
  },

  //领取空码
  emptyCodePage: (params) => {
    return service.get(`/source/empty/code/page?${stringify(params)}`);
  },
  emptyCodeInsert: (params) => {
    return service.post('/source/empty/code/insert', params);
  },
  emptyCodeDownload: (params) => {
    return fileService.get(`/source/empty/code/exportExcel?${stringify(params)}`);
  },

  // 补码换码
  changeCodePage: (params) => {
    // return service.get(`/source/stock/waitStockIn?${stringify(params)}`);
    return service.get(`/source/order/code/waitStockInCode?${stringify(params)}`); // 待扫码入库分页
  },
  changeCodeInsert: (params) => {
    return fileService.post(`/source/stock/exportExcel?${stringify(params)}`); // 补码换码领取
  },
  getCodeList: (params) => {
    return service.get(`/source/stock/getCodeList?${stringify(params)}`); // 补码换码获取详情
  },
  // 生成二维码
  createQrCode: (params) => {
    return service.get(`/source/code/createQrCode?${stringify(params)}`);
  },

  // 获取二维码列表
  getBarCodeList: (params) => {
    return service.get(`/source/code/getBarCodeList?${stringify(params)}`);
  },
  // 获取二维码详情
  getBatchNumberList: (params) => {
    return service.get(`/source/code/getBatchNumberList?${stringify(params)}`);
  },
  // 下载二维码
  downLoadExcel: (params) => {
    return service({
      url: `/source/code/exportExcel?${stringify(params)}`,
      method: 'get',
      type: 'application/octet-stream',
      responseType: 'blob'
    });
    // return fileService.get(`/source/code/exportExcel?${stringify(params)}`);
  },
  // 下载二维码
  downloadQrCode: (params) => {
    return fileService.get(`/source/code/downloadQrCode?${stringify(params)}`);
  },
  // 手动生成二维码列表
  getTraceCodeList: (params) => {
    return service.get(`/source/code/getTraceCodeList?${stringify(params)}`);
  },
  // 生成二维码
  saveTraceCode: (params) => {
    return service.post('/source/code/saveTraceCode', params);
  },
  // 下载手动生成二维码
  exportExcelNew: (params) => {
    return service({
      url: `/source/code/exportExcelNew?${stringify(params)}`,
      method: 'get',
      type: 'application/octet-stream',
      responseType: 'blob'
    });
    // return fileService.get(`/source/code/exportExcelNew?${stringify(params)}`);
  },
  // 删除手动生成二维码
  deleteProductCode: (params) => {
    return service.get(`/source/code/deleteProductCode?${stringify(params)}`);
  },
  // 新版生成条码值
  generateBarCodeNew: (params) => {
    return service.post('/source/code/generateBarCodeNew', params);
  }
};
export default codeManageApi;
