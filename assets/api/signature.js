import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';

const Signature = {
  // 电子签章列表
  signaturePage: (params) => {
    return service.get(`/source/signature/signaturePage?${stringify(params)}`);
  },
  // 电子签章节点
  signatureDetail: (params) => {
    return service.get(`/source/signature/signatureDetail?${stringify(params)}`);
  },
  // 下载pdf
  download: (params) => {
    return service({
      url: `/source/signature/download?${stringify(params)}`,
      method: 'get',
      responseType: 'blob'
    });
  },
  // 申请并且生成检疫报告pdf
  inspectionReport: (params) => {
    return service.get(`/source/signature/inspectionReport?${stringify(params)}`);
  },
  // 检疫报告审批通过
  inspectionReportUpdate: (params) => {
    return service.get(`/source/signature/inspectionReportUpdate?${stringify(params)}`);
  },
  // 申请并且生成食品销售凭证pdf
  invoice: (params) => {
    return service.post(`/source/signature/invoice`, params);
  },
  // 食品销售审批通过
  invoiceUpdate: (params) => {
    return service.post(`/source/signature/invoiceUpdate`, params);
  },
  // 签章完成回调接口
  PDFCallBack: (params) => {
    return service.post(`/source/signature/PDFCallBack`, params);
  },
  // 查看签章详情以及节点
  getSignatureByid: (params) => {
    return service.get(`/source/signature/getSignatureByid?${stringify(params)}`); //领取空码--查看详情
  },
  // pdf转图片
  pdfPreview: (params) => {
    return service.get(`/source/signature/pdfPreview/${0}?${stringify(params)}`);
  },
  //
  getSignatureBytype: (params) => {
    return service.get(`/source/signature/getSignatureBytype?${stringify(params)}`);
  },
  // 审批列表
  getApproveList: (params) => {
    return service.post(`/source/approve/approveList`, params);
  },
  // 审批同意
  approveAgree: (params) => {
    return service.get(`/source/approve/approveAgree?${stringify(params)}`);
  },
  // 审批拒绝
  approveDisagree: (params) => {
    return service.get(`/source/approve/approveDisagree?${stringify(params)}`);
  }
};
export default Signature;
