import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';
const proCityLetCodeApi = {
  insertCheck: (params) => {
    return service.get(`/source/online/apply/insertCheck?${stringify(params)}`);
  },
  insert: (params) => {
    return fileService.post('/source/online/apply/insert', params);
  },
  page: (params) => {
    return service.get(`/source/online/apply/page?${stringify(params)}`);
  },
  downloadExcel: (params) => {
    return fileService.get(`/source/online/apply/exportExcel?${stringify(params)}`);
  },
  downloadExcelUrl: '/api/source/online/apply/exportExcel'
};
export default proCityLetCodeApi;
