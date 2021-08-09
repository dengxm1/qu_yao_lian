import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MsgManage from './msgManage/index'; //主体信息管理
import CertifyManage from './certifyManage/index'; //证照管理
import AssistManage from './assistManage/index'; //辅助功能

import './index.less';
let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const CompanyManage = (props) => {
  return (
    <Switch>
      <Route exact path={routerPrefix + '/public/companyManage/msgManage'} component={MsgManage} />
      <Route
        exact
        path={routerPrefix + '/public/companyManage/certifyManage'}
        component={CertifyManage}
      />
      <Route
        exact
        path={routerPrefix + '/public/companyManage/assistManage'}
        component={AssistManage}
      />
    </Switch>
  );
};
export default CompanyManage;
