import service from 'utils/service';
import { stringify } from 'qs';

const stockInOutApi = {
  pageStockIn: (params) => {
    // return service.get(`/source/stock/pageStockIn?${stringify(params)}`);
    return service.get(`/source/order/in/page?${stringify(params)}`); // &status=3
  },
  pageDelStockIn: (params) => {
    return service.get(`/source/stockin/del/page?${stringify(params)}`);
  },
  pageStockOut: (params) => {
    // return service.get(`/source/stock/pageStockOut?${stringify(params)}`);
    return service.get(`/source/order/out/page?${stringify(params)}`); // &status=4
  },
  pageDelStockOut: (params) => {
    // return service.get(`/source/stockout/del/page?${stringify(params)}`);
    return service.get(`/source/order/out/pageCancel?${stringify(params)}`); //5
  },
  updateStockIn: (params) => {
    return service.post('/source/stock/updateStockIn', params); // 修改入库记录
  },
  updateStockOut: (params) => {
    // params.status = 4;
    // return service.post('/source/stock/updateStockOut', params);
    return service.post('/source/order/out/update', params); // 修改出库记录
  },
  delStockIn: (params) => {
    return service.get(`/source/stockout/del/delStockIn?${stringify(params)}`); // 撤销入库记录
  },
  delStockOut: (params) => {
    params.orderId = params.id;
    delete params.id;
    // return service.post('/source/stockout/del/delStockOut', params);'
    // params.status = 5;
    // return service.post('/source/order/out/cancel', params); // 撤销出库记录
    return service.get(`/source/order/out/cancelOrder?${stringify(params)}`); // 撤销出库记录
  },
  pageStockOutList: (params) => {
    // params.hasDel = 0;
    return service.get(`/source/order/out/detail?${stringify(params)}`); // 出库订单详情
  },

  pageStockInList: (params) => {
    return service.get(`/source/order/in/detail?${stringify(params)}`); // 入库订单详情
  },
  pageStockInListCode: (params) => {
    return service.get(`/source/order/in/code?${stringify(params)}`); // 入库订单详情
  },
  pageStockOutListCode: (params) => {
    // params.hasDel = 0;
    return service.get(`/source/order/out/code?${stringify(params)}`); // 入库订单详情
  },
  stockInOutBack: (params) => {
    return service.get(`/source/order/out/cancelProduct?${stringify(params)}`); // 出库订单详情撤销
  },
  deletestockInOutManCode: (params) => {
    params.hasDel = 0;
    return service.post(`/source/order/out/cancelCode`, params); // 出库订单撤销
  }
};
export default stockInOutApi;
