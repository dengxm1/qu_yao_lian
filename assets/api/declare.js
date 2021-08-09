import service from 'utils/service';
const baseURL = '/api';
import { stringify } from 'qs';
const testApi = {
  addOrUpdate: (isAddHandle, params) => {
    let apiUrl = isAddHandle ? '/source/report/code/insert' : '/source/report/code/update';
    return service.post(apiUrl, params);
  },
  delete: (params) => {
    return service.get(`/source/report/code/delById${stringify(params)}`);
  },
  detail: (params) => {
    return service.get(`/source/report/code/load?${stringify(params)}`);
  },
  list: (params) => {
    return service.get(`/source/report/code/page?${stringify(params)}`);
  },
  scanning: (params) => {
    let apiUrl = '/source/quarantine/scanningForm';
    return service.post(apiUrl, params);
  },
  download: (params) => {
    return service.get(`/source/resouce/download?${stringify(params)}`);
  },
  fileList: (params) => {
    return service.get(`/source/resouce/list?${stringify(params)}`);
  },
  fileListNew: (params) => {
    return service.get(`/source/resouce/fileList?${stringify(params)}`);
  },

  reportUpdate: (params) => {
    return service.post('/source/report/code/update', params); // 证书申报修改
  },

  draftList: (params) => {
    return service.get(`/source/report/code/pageDraft?${stringify(params)}`);
  },
  report: (params) => {
    return service.post('/source/report/code/report', params); // 报备
  },
  reportToDraft: (params) => {
    return service.post('/source/report/code/toDraft', params); // 报备草稿
  },
  reportDraftUpdate: (params) => {
    return service.post('/source/report/code/draftUpdate', params); // 报备草稿修改
  },
  reportEdit: (params) => {
    return service.post('/source/report/code/reportUpdate', params); // 报备修改
  },
  reportDel: (params) => {
    return service.get(`/source/report/code/del?${stringify(params)}`); //报备删除
  },
  reportBack: (params) => {
    return service.post('/source/report/code/reportBack', params); // 报备撤回
    // return service.get(`/source/report/code/reportBack?${stringify(params)}`); //报备撤回
  },
  uploadInspe: (params) => {
    return service.post('/source/report/code/uploadInspe', params); // 上传检验检疫单
  },
  scanningCustoms: (params) => {
    return service.post('source/quarantine/scanningCustoms', params); // 扫描报关单
  },

  cityRegulatory: (params) => {
    return service.get(`/source/user/cityRegulatory?${stringify(params)}`); // 获取区县编码
  },
  allRegulatoryTree: (params) => {
    return service.get(`/source/user/allRegulatoryTree?${stringify(params)}`); // 获取全部区县编码
  }
};
export default testApi;
