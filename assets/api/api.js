import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';

const indexApi = {
  // 根据字典类型获取字典值对象
  getDirctionaryMap: (params) => {
    return service.get(`/source/dictionary/value/map/${params}`);
  },
  // 根据字典类型获取字典值列表
  getDirctionaryList: (params) => {
    return service.get(`/source/dictionary/value/list/${params}`);
  }
};
export default indexApi;
