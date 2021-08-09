import service from 'utils/service';

const informFillingApi = {
  //生产企业管理--列表
  manufacturerList: (params) => {
    return service.post(`/source/companyRecord/manufacturerList`, params);
  },
  //生产企业管理--新增
  manufacturerAdd: (params) => {
    return service.post(`/source/companyRecord/manufacturerAdd`, params);
  },
  //生产企业管理--删除
  manufacturerDelete: (params) => {
    return service.post(`/source/companyRecord/manufacturerDelete`, params);
  },
  //生产企业管理--批量删除
  manufacturerDeleteList: (params) => {
    return service.get(`/source/companyRecord/manufacturerDeleteList?ids=${params}`);
  },
  //生产企业管理--修改
  manufacturerUpdate: (params) => {
    return service.post(`/source/companyRecord/manufacturerUpdate`, params);
  },
  //生产企业管理--批量导入
  uploadManufacturerModel: (params) => {
    return service.post(`/source/companyRecord/uploadManufacturerModel`, params);
  },

  //供应商管理--列表
  supplierList: (params) => {
    return service.post(`/source/companyRecord/supplierList`, params);
  },
  //供应商管理--新增
  supplierAdd: (params) => {
    return service.post(`/source/companyRecord/supplierAdd`, params);
  },
  //供应商管理--删除
  supplierDelete: (params) => {
    return service.post(`/source/companyRecord/supplierDelete`, params);
  },
  //供应商管理--批量删除
  supplierDeleteList: (params) => {
    return service.get(`/source/companyRecord/supplierDeleteList?ids=${params}`);
  },
  //供应商管理--修改
  supplierUpdate: (params) => {
    return service.post(`/source/companyRecord/supplierUpdate`, params);
  },
  //供应商管理--批量导入
  uploadSupplierModel: (params) => {
    return service.post(`/source/companyRecord/uploadSupplierModel`, params);
  },

  //经销商管理--列表
  buyerList: (params) => {
    return service.post(`/source/companyRecord/buyerList`, params);
  },
  //经销商管理--新增
  buyerAdd: (params) => {
    return service.post(`/source/companyRecord/buyerAdd`, params);
  },
  //经销商管理--删除
  buyerDelete: (params) => {
    return service.post(`/source/companyRecord/buyerDelete`, params);
  },
  //经销商管理--批量删除
  buyerDeleteList: (params) => {
    return service.get(`/source/companyRecord/buyerDeleteList?ids=${params}`);
  },
  //经销商管理--修改
  buyerUpdate: (params) => {
    return service.post(`/source/companyRecord/buyerUpdate`, params);
  },
  //经销商管理--批量导入
  uploadBuyerModel: (params) => {
    return service.post(`/source/companyRecord/uploadBuyerModel`, params);
  },

  //自产药品管理--列表
  productList: (params) => {
    return service.post(`/source/productRecord/productList`, params);
  },
  //自产药品管理--新增
  productAdd: (params) => {
    return service.post(`/source/productRecord/productAdd`, params);
  },
  //自产药品管理--删除
  productDelete: (params) => {
    return service.post(`/source/productRecord/productDelete`, params);
  },
  //自产药品管理--批量删除
  productDeleteList: (params) => {
    return service.get(`/source/productRecord/productDeleteList?ids=${params}`);
  },
  //自产药品管理--修改
  productUpdate: (params) => {
    return service.post(`/source/productRecord/productUpdate`, params);
  },
  //自产药品管理--批量导入
  uploadProductModel: (params) => {
    return service.post(`/source/productRecord/uploadProductModel`, params);
  },

  //流通药品管理--列表
  circulationProductList: (params) => {
    return service.post(`/source/productRecord/circulationProductList`, params);
  },
  //流通药品管理--新增
  circulationProductAdd: (params) => {
    return service.post(`/source/productRecord/circulationProductAdd`, params);
  },
  //流通药品管理--删除
  circulationProductDelete: (params) => {
    return service.post(`/source/productRecord/circulationProductDelete`, params);
  },
  //流通药品管理--批量删除
  circulationProductDeleteList: (params) => {
    return service.get(`/source/productRecord/circulationProductDeleteList?ids=${params}`);
  },
  //流通药品管理--修改
  circulationProductUpdate: (params) => {
    return service.post(`/source/productRecord/circulationProductUpdate`, params);
  },
  //流通药品管理--批量导入
  uploadCirculProductModel: (params) => {
    return service.post(`/source/productRecord/uploadCirculProductModel`, params);
  }
};
export default informFillingApi;
