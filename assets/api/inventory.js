import service from 'utils/service';
import { stringify } from 'qs';
const loginApi = {
  // 库存列表
  queryStockList: (params) => {
    // return service.post('/source/zslStock/list', params);
    return service.post('/source/zslStock/list', params);
  },
  // 库存明细列表
  recordList: (params) => {
    return service.post('source/zslStockRecord/list', params);
  },
  // 列表查看接口
  zslStockRecord: (params) => {
    return service.post('/source/zslStock/detail/list', params);
    // return service.post('/zslStockRecord/list', params);
  },
  zslStockDeal: (params) => {
    return service.post('/source/zslStockRecord/deal', params);
    // return service.post('/zslStockRecord/deal', params);
  }
};
export default loginApi;
