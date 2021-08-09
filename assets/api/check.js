import service from 'utils/service';
import { stringify } from 'qs';
const checkApi = {
  // 批批检测列表
  getCheckList: (params) => {
    return service.post(`/source/check/getCheckList`, params);
  },
  // 查看检验报告
  getTestReport: (params) => {
    return service.get(`/source/check/getTestReport?${stringify(params)}`);
  },
  // 新增检测报告
  generateTestReport: (params) => {
    return service.post(`/source/check/generateTestReport`, params);
  },

  updateTestReport: (params) => {
    return service.post(`/source/check/updateTestReport`, params);
  }
};
export default checkApi;
