import service from 'utils/service';
import { stringify } from 'qs';

const companyApi = {
  // 许可证列表
  getLicenseInfo: (params) => {
    return service.post('/source/license/getLicenseInfo', params);
  },
  // 许可证详情
  getLicenseDetail: (params) => {
    return service.get(`/source/license/getLicenseDetail?id=${params}`);
  },
  // 获取信任的下游企业列表
  getTrustDownCompany: (params) => {
    return service.post(`/source/trustCompany/getTrustDownCompany`, params);
  },
  // 获取信任的上游企业列表
  getTrustUpCompany: (params) => {
    return service.post(`/source/trustCompany/getTrustUpCompany`, params);
  },
  // 添加信任企业
  addTrustCompany: (params) => {
    return service.post(`/source/trustCompany/addTrustCompany`, params);
  },
  // 获取可以信任的企业列表（相互备案）
  getCanTrustCompany: (params) => {
    return service.post(`/source/trustCompany/getCanTrustCompany`, params);
  },
  // 彼此删除信任
  deleteTrust: (params) => {
    return service.get(`/source/trustCompany/deleteTrust?${stringify(params)}`);
  },
  // 重新申请信任
  reTrust: (params) => {
    return service.get(`/source/trustCompany/reTrust?${stringify(params)}`);
  }
};
export default companyApi;
