import service from 'utils/service';
import { stringify } from 'qs';
const loginApi = {
  //登录
  login: (params) => {
    return service.post('/source/user/login', params);
  },
  config: (params) => {
    return service.get('/system/config', params);
  },
  checkIsLogin: () => {
    return service.get('/source/user/checkLogin');
  },
  updatePassword: (params) => {
    return service.post('/source/user/updatePassword', params);
  },
  logout: () => {
    return service.post('/source/user/logout');
  },
  //功能权限管理
  getModuleRoles: (params) => {
    return service.get(`/source/module/userModule?${stringify(params)}`);
  },
  checkLogin: (params) => {
    return service.post('/source/user/checkLogin', params);
  },
  downLoad: () => {
    return service({
      url: `/downloadModel/addProductBatchdownload`,
      method: 'post',
      responseType: 'blob'
    });
  },
  // 获取企业信息
  userLoginReturn: (params) => {
    return service.post('/wx/userLoginReturn', params);
  },
  // 获取企业工商信息
  getCompanyList: (companyName) => {
    return service.get('/source/user/getCompanyList');
  },
  // 用户注册
  register: (params) => {
    return service.post('/source/user/register', params);
  },
  // 发送验证码
  send: (phone, regulatoryCode, type) => {
    return service.get(
      `/sms/sendSms?phoneNumber=${phone}&regulatoryCode=${regulatoryCode}&type=${type}`
    );
  },
  // 激活企业信息
  firstAddCompany: (params) => {
    return service.post('/source/company/firstAddCompany', params);
  },
  //
  // 获取工商企业信息
  getCompanyInfo: (companyName, uniformCode) => {
    return service.get(
      `/source/company/getCompanyInfo?companyName=${companyName}&uniformCode=${uniformCode}`
    );
  },
  //申请加入企业
  joinCompany: (params) => {
    return service.post('/source/company/joinCompany', params);
  },
  // 获取已激活企业
  getJoinCompanyList: (companyName, uniformCode) => {
    return service.get(
      `/source/company/getCompanyList?companyName=${companyName}&uniformCode=${uniformCode}`
    );
  },
  // 获取申请接入列表
  getApplyList: (companyId, userId) => {
    return service.get(`/source/apply/getApplyList?companyId=${companyId}&userId=${userId}`);
  },
  // 同意加入
  agree: (params) => {
    return service.post('/source/apply/agree', params);
  },
  // 不同意加入
  disAgree: (params) => {
    return service.post('/source/apply/disAgree', params);
  },
  // 设置为管理员
  setAdmin: (params) => {
    return service.post('/source/admin/setAdmin', params);
  },
  // 取消设置为管理员
  clearAdmin: (params) => {
    return service.post('/source/admin/cancelAdmin', params);
  },
  // 切换企业
  changeCompany: (userId, companyId) => {
    return service.get(`/source/company/changeCompany?companyId=${companyId}&userId=${userId}`);
  },
  // 退出企业
  exitCompany: (userId, companyId) => {
    return service.get(`/source/company/exitCompany?companyId=${companyId}&userId=${userId}`);
  },
  //
  getCurrentCompany: (userId) => {
    return service.get(`/source/company/getCurrentCompany?userId=${userId}`);
  },
  // 忘记密码
  forgetPassword: (params) => {
    return service.post('/source/user/forgetPassword', params);
  },
  // /source/company/getUserCompanyList
  getUserCompanyList: (userId) => {
    return service.get(`/source/company/getUserCompanyList?userId=${userId}`);
  },
  // 忘记密码验证手机号码是否存在
  checkPhoneExist: (mobile) => {
    return service.get(`/source/user/checkPhoneExist?mobile=${mobile}`);
  },
  //
  getApplyNum: (companyId) => {
    return service.get(`/source/approve/getWaitApproveNums?companyId=${companyId}`);
  },
  // 退出后获取用户信息
  getUserInfo: (params) => {
    return service.get(`/source/user/getUserInfo?${stringify(params)}`);
  },
  getCompanyByUniformcode: (params) => {
    return service.post(`/source/company/getCompanyByUniformcode`, params);
  },
  // 修改用户名
  updateUserInfo: (params) => {
    return service.post(`/source/user/updateUserInfo`, params);
  },
  // 浙里办登录
  zlbLogin: (params) => {
    const url = ['/source/user/getZlbPersonUserInfo', '/source/user/getZlbUserInfo'];
    return service.get(`${url[params.zlbUserType]}?id=${params.id}`);
  },
  // 浙里办账号绑定
  bindZllAccount: (prarms) => {
    return service.post(`/source/user/zlbBindUser`, prarms);
  },
  // 浙里办法人登录获取企业信息
  getZlbCompanyInfoByUserId: (params) => {
    return service.get(`/source/user/getZlbCompanyInfoByUserId?${stringify(params)}`);
  },
  // 获取最新记录
  load: (params) => {
    return service.get(`/source/notice/load?${stringify(params)}`);
  }
};
export default loginApi;
