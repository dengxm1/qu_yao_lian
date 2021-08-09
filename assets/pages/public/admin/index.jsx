import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NoticeManage from './noticeManage'; // 通知公告管理
import UserManage from './userManage'; // 用户管理
import CompanyManage from './companyManage'; // 企业管理
import LogManage from './logManage'; // 日志管理
import RoleManage from './roleManage'; // 角色管理
import MenuManage from './menuManage'; // 菜单管理
import PowerManage from './powerManage'; // 权限管理
import ModuleManage from './moduleManage';
import DictionariesManage from './dictionariesManage'; // 字典管理
import LoginLog from './LoginLog'; // 字典管理

import './index.less';

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const Admin = () => {
  return (
    <Switch>
      <Route exact path={routerPrefix + '/public/admin/noticeManage'} component={NoticeManage} />
      <Route exact path={routerPrefix + '/public/admin/moduleManage'} component={ModuleManage} />
      <Route
        exact
        path={routerPrefix + '/public/admin/dictionariesManage'}
        component={DictionariesManage}
      />
      <Route exact path={routerPrefix + '/public/admin/userManage'} component={UserManage} />
      <Route exact path={routerPrefix + '/public/admin/companyManage'} component={CompanyManage} />
      <Route exact path={routerPrefix + '/public/admin/logManage'} component={LogManage} />
      <Route exact path={routerPrefix + '/public/admin/roleManage'} component={RoleManage} />
      <Route exact path={routerPrefix + '/public/admin/menuManage'} component={MenuManage} />
      <Route exact path={routerPrefix + '/public/admin/powerManage'} component={PowerManage} />
      <Route exact path={routerPrefix + '/public/admin/LoginLog'} component={LoginLog} />
    </Switch>
  );
};

export default Admin;
