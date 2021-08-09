import service from 'utils/service';
import fileService from 'utils/fileService';

import { stringify } from 'qs';
const productOrderApi = {
  // 工单列表
  productionOrderList: (params) => {
    return service.post(`/source/productionOrder/productionOrderList`, params);
  },

  // 工单详情
  productionOrderDetail: (params) => {
    return service.post(`/source/productionOrder/productionOrderDetail`, params);
  },
  //   工单删除
  productionOrderDelete: (params) => {
    return service.post(`/source/productionOrder/productionOrderDelete`, params);
  },
  //   工单新增
  productionOrderAdd: (params) => {
    return service.post(`/source/productionOrder/productionOrderAdd`, params);
  },
  //   工单编辑
  productionOrderUpdate: (params) => {
    return service.post(`/source/productionOrder/productionOrderUpdate`, params);
  }
};
export default productOrderApi;
