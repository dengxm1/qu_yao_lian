import service from 'utils/service';
import fileService from 'utils/fileService';
import { stringify } from 'qs';

const adminApi = {
  // 通知公告管理
  noticePage: (params) => {
    // 通知分页
    return service.get(`/source/notice/page?${stringify(params)}`);
  },
  noticeInsert: (params) => {
    // 新增通知
    return service.post('/source/notice/insert', params);
  },
  noticeDetail: (params) => {
    //通知详情
    return service.get(`/source/notice/load?${stringify(params)}`);
  },
  noticeUpdate: (params) => {
    //通知修改
    return service.post('/source/notice/update', params);
  },

  noticeDel: (params) => {
    // 删除通知
    return service.get(`/source/notice/delById?${stringify(params)}`);
  },
  noticeFileList: (params) => {
    // 通知文件列表
    return service.get(`/source/resouce/list?${stringify(params)}`);
  },
  noticePreviewUrl: '/api/source/resouce/preview', // 通知文件预览

  //首页--获取通知
  homeNotice: (params) => {
    // 通知文件列表
    return service.get(`/source/notice/homeNotice?${stringify(params)}`);
  },
  //首页--获取问题
  homeProblem: (params) => {
    // 通知文件列表
    return service.get(`/source/notice/homeProblem?${stringify(params)}`);
  },
  //通知公告--获取获取模块
  noticeModule: (params) => {
    return service.get(`/source/noticeModule/list?${stringify(params)}`);
  },
  //首页--获取资源模块
  resources: (params) => {
    return service.get(`/source/notice/resources?${stringify(params)}`);
  },
  //下载文件
  download: (params) => {
    return fileService.get(`/source/resouce/download?${stringify(params)}`);
  },

  // 用户管理
  userPage: (params) => {
    // 用户分页
    return service.get(`/source/user/getUserPage?${stringify(params)}`);
  },
  setSuperAdmin: (params) => {
    // 设置超级管理员
    return service.get(`/source/user/setSuperAdmin?${stringify(params)}`);
  },

  // 企业管理
  companyPage: (params) => {
    // 企业分页
    return service.post(`source/admin/getCompanyList`, params);
  },

  // 日志管理
  logTree: (params) => {
    // 日志树
    return service.get(`/source/log/tree?${stringify(params)}`);
  },
  logPage: (params) => {
    // 日志分页
    return service.get(`/source/log/list?${stringify(params)}`);
  },
  logDetailed: (params) => {
    // 日志详情
    return service.get(`/source/log/load?${stringify(params)}`);
  },

  //角色管理
  rolePage: (params) => {
    // 查询列表
    return service.get(`/source/role/page?${stringify(params)}`);
  },
  roleModuleTree: (params) => {
    // 角色模块树
    return service.get(`/source/module/roleModuleTree?${stringify(params)}`);
  },
  roleModule: (params) => {
    // 角色模块授权
    return service.post('/source/role/roleModule', params);
  },
  roleInsert: (params) => {
    // 角色模块新增
    return service.post('/source/role/insert', params);
  },
  roleUpdate: (params) => {
    // 角色模块修改
    return service.post('/source/role/update', params);
  },
  roleDelete: (params) => {
    // 角色模块删除
    return service.get(`/source/role/delById?${stringify(params)}`);
  },

  noSelectList: (params) => {
    // 用户未授权角色列表
    return service.get(`/source/role/noSelectList?${stringify(params)}`);
  },
  userRoleList: (params) => {
    // 用户已授权角色列表
    return service.get(`/source/role/userRoleList?${stringify(params)}`);
  },
  userRole: (params) => {
    // 用户角色授权
    return service.post('/source/role/userRole', params);
  },

  // 菜单管理
  moduleTree: (params) => {
    // 菜单树
    return service.get(`/source/module/tree?${stringify(params)}`);
  },
  modulePage: (params) => {
    // 子菜单列表
    return service.get(`/source/module/page?${stringify(params)}`);
  },
  moduleInsert: (params) => {
    // 新增菜单
    return service.post('/source/module/insert', params);
  },
  moduleUpdate: (params) => {
    // 更新菜单
    return service.post('/source/module/update', params);
  },
  moduleDelById: (params) => {
    // 删除菜单
    return service.get(`/source/module/delById?${stringify(params)}`);
  },
  moduleLoad: (params) => {
    // 获取数据详细信息
    return service.get(`/source/module/load?${stringify(params)}`);
  },

  // 权限管理
  accessPage: (params) => {
    // 权限列表
    return service.get(`/source/access/page?${stringify(params)}`);
  },
  accessInsert: (params) => {
    // 新增权限
    return service.post('/source/access/insert', params);
  },
  accessUpdate: (params) => {
    // 更新权限
    return service.post('/source/access/update', params);
  },
  accessDelById: (params) => {
    // 删除权限
    return service.get(`/source/access/delById?${stringify(params)}`);
  },

  // 企业切换
  userCompanyList: (params) => {
    // 企业列表
    return service.get(`/source/user/userCompanyList?${stringify(params)}`);
  },
  changeCompany: (params) => {
    // 切换企业
    return service.get(`/source/user/changeCompany?${stringify(params)}`);
  },
  recordList: (params) => {
    // 获取企业消息提醒信息--查看更多
    return service.get(`/source/apply/record/list?${stringify(params)}`);
  },
  noRaedList: (params) => {
    // 获取企业消息提醒信息--首页
    return service.get(`/source/apply/record/noRaed?${stringify(params)}`);
  },

  recordRead: (params) => {
    // 企业消息信息标记已读
    return service.get(`/source/apply/record/read?${stringify(params)}`);
  },
  recordReadAll: (params) => {
    // 企业消息信息批量已读
    return service.post('/source/apply/record/readAll', params);
  },
  dictManList: (params) => {
    // 字典管理-字典列表查询
    const { pageNum, pageSize, type, name } = params;
    return service.get(
      `/source/dictionary/type/page?currentPage=${pageNum}&pageSize=${pageSize}&type=${type ||
        ''}&name=${name || ''}`,
      params
    );
  },
  addDictManList: (params) => {
    // 字典管理-字典列表添加
    return service.post('/source/dictionary/type/insert', params);
  },
  deleteDictManList: (params) => {
    // 字典管理-字典列表删除
    return service.get(`/source/dictionary/type/delTypeById?id=${params.id}`, params);
  },
  editDictManList: (params) => {
    // 字典管理-字典列表修改
    return service.post(`/source/dictionary/type/update`, params);
  },
  addDictManListKid: (params) => {
    // 字典管理-字典列表添加子元素
    return service.post(`/source/dictionary/value/add`, params);
  },
  dictManListKid: (params) => {
    const { pageNum, pageSize, name } = params;
    // 字典管理-字典列表添加子元素
    return service.get(
      `/source/dictionary/value/page?currentPage=${pageNum}&pageSize=${pageSize}&name=${name ||
        ''}&typeId=${params.typeId}`,
      params
    );
  },
  editDictManListKids: (params) => {
    // 字典管理-字典列表删除
    return service.post(`/source/dictionary/value/update`, params);
  },
  deleteDictManListKids: (params) => {
    // 字典管理-字典列表删除
    return service.get(`/source/dictionary/value/delValueById?id=${params.id}`, params);
  },
  noticeUpdateJson: (params) => {
    //信息资源发布--修改
    return service.post(`/source/notice/update`, params);
  },
  resouceUpload: (params) => {
    // 上传图片
    return service.post(`/source/resouce/upload`, params);
  },

  getUserList: (params) => {
    return service.post(`/source/admin/getUserList`, params);
  },
  getRoleUserList: (params) => {
    return service.post(`/source/role/getUserList`, params);
  },
  // 更新企业信息
  updateCompany: (params) => {
    return service.post(`/source/company/updateCompany`, params);
  },
  // 企业模板管理
  templateList: (params) => {
    return service.post(`/source/admin/templateList`, params);
  },
  // 企业模板新增
  addTemplate: (params) => {
    return service.post(`/source/admin/addTemplate`, params);
  },
  // 企业模板编辑
  updateTemplate: (params) => {
    return service.post(`/source/admin/updateTemplate`, params);
  },
  // 删除模板
  deleteTemplate: (params) => {
    return service.post(`/source/admin/deleteTemplate`, params);
  },
  // 企业模板树
  companyTemplateModuleTree: (params) => {
    return service.get(`/source/admin/companyTemplateModuleTree?${stringify(params)}`);
  },
  // 企业模板添加对应菜单
  addModule: (params) => {
    return service.post(`/source/admin/addModule`, params);
  },
  // 获取当前企业所有用户
  getUserListWithCompany: (params) => {
    return service.post(`/source/admin/getUserListWithCompany`, params);
  },
  // 删除用户
  deleteUser: (params) => {
    return service.post(`/source/admin/deleteUser`, params);
  },
  // 授予角色给用户
  addUser: (params) => {
    return service.post(`/source/role/addUser`, params);
  },
  // 获取所有企业
  getAdminCompanyList: (params) => {
    return service.post(`/source/admin/getCompanyListByTempateId`, params);
  },
  // 企业模板添加对应企业
  addAdminCompany: (params) => {
    return service.post(`/source/admin/addCompany`, params);
  },
  // 菜单管理查询
  getModuleByTitle: (params) => {
    return service.get(`/source/module/getModuleByTitle?${stringify(params)}`);
  },
  // 用户管理禁用
  disableUser: (params) => {
    return service.post(`/source/admin/disableUser`, params);
  },
  // 用户管理启用
  enableUser: (params) => {
    return service.post(`/source/admin/enableUser`, params);
  },
  // 登录日志列表
  getLoginLog: (params) => {
    return service.get(`/source/log/getLoginLog?${stringify(params)}`);
  },
  // 通知公告阅后即清除
  cleanNotice: (params) => {
    return service.post(`/source/user/cleanNotice`, params);
  },
  // 离职转让权限
  transferPermission: (params) => {
    return service.post(`/source/admin/transferPermission`, params);
  }
};
export default adminApi;
