import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';
const WareHouse = {
  stockRecordList: (params) => {
    return service.post(`/source/stockRecord/stockRecordList`, params);
  },

  stockRecordAdd: (params) => {
    return service.post(`/source/stockRecord/stockRecordAdd`, params);
  },

  stockRecordDelete: (params) => {
    return service.post(`/source/stockRecord/stockRecordDelete`, params);
  },
  stockRecordDetail: (params) => {
    return service.post(`/source/stockRecord/stockRecordDetail`, params);
  },

  stockRecordUpdate: (params) => {
    return service.post(`/source/stockRecord/stockRecordUpdate`, params);
  }
};
export default WareHouse;
