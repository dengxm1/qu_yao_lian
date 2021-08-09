import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';

const dictionaryApi = {
  // 删除检验人
  deleteInspector: (params) => {
    return service.post(`/source/inspector/deleteInspector`, params);
  },
  // 新增检验人
  inspectorAdd: (params) => {
    return service.post(`/source/inspector/inspectorAdd`, params);
  },
  // 检验人列表
  inspectorList: (params) => {
    return service.post(`/source/inspector/inspectorList`, params);
  }
};
export default dictionaryApi;
