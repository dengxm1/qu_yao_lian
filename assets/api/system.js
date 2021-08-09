import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';

const SystemApi = {
  // 获取左侧栏路由
  userModule: (params) => {
    return service.get(`/source/module/userModule`, params);
  },
  // 根据字典类型获取字典值
  getValue: (params) => {
    return service.get(`/source/dictionary/value/getValue?${stringify(params)}`);
  },
  // 获取行政单位 三级
  getRegion: (params) => {
    return service.get(`/source/region/getRegion?${stringify(params)}`);
  },
  // 获取行政单位 二级
  getRegionNew: (params) => {
    return service.get(`/source/region/getRegionNew?${stringify(params)}`);
  },
  // 获取监管端token
  getVerifyKey: (params) => {
    return service.get(`/source/thirdapi/youquan/getVerifyKey?${stringify(params)}`);
  },
  // 获取监管单位
  getRegulatory: (params) => {
    return service.get(`/source/region/getRegulatory?${stringify(params)}`);
  }
};
export default SystemApi;
