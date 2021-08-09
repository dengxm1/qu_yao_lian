import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import routerPath from 'router/routerPath';

import Header from 'components/Header';
import Bundle from 'router/bundle';
import NotFound from 'components/NotFound';
import NoAccess from 'components/NoAccess';
import Public from 'bundle-loader?lazy&name=public!pages/public';
import ScanCode from 'bundle-loader?lazy&name=scanCode!pages/scanCode';
import loginApi from 'api/login';
import authUtils from 'utils/authUtils';
import './index.less';

//按路由访问顺序
// const pageComponents = [Mod1];
const pageComponents = [Public, ScanCode];
const { app, modTypes, modules, modules2 } = routerPath;

const Layout = () => {
  const [renderKey, setRenderKey] = useState(0);
  const [globalValue, setGlobalValue] = useState(null);

  const { newModules, oldIndexs } = authUtils.getModuleRoles();

  const getRootRedirect = (modules) => {
    if (modules[0].path === window.location.pathname && modules[0].children) {
      return modules[0].children[0].path;
    }
    return modules[0].path;
  };

  //TODO 测试使用

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    if (userInfo) {
      loginApi.getUserInfo().then((res) => {
        if (res?.data?.success) {
          // authUtils.getModules(res.data.data.modules);
          // authUtils.testSetModuleRoles(res.data.data.modules);
          authUtils.getModules(modules);
          authUtils.testSetModuleRoles(modules);
          setRenderKey(renderKey + 1);
          sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
          sessionStorage.setItem('companyInfo', JSON.stringify(res.data.data));
        }
      });
    }
    if (window.location.search) {
      window.location.search = '';
    }
  }, []);

  return (
    <div className="container">
      <Helmet>
        <title>
          {globalValue && globalValue.provinceName && globalValue.systemName
            ? `${globalValue.provinceName}${globalValue.systemName}`
            : '衢州市药品信息化追溯平台'}
        </title>
        <link rel="icon" href={globalValue && globalValue.logoUrl ? globalValue.logoUrl : ''} />
      </Helmet>
      <Header key={renderKey} modules={newModules} />
      {newModules.length > 0 ? (
        <Switch>
          {authUtils.getHomePath() === getRootRedirect(newModules) ? null : (
            <Route
              exact
              path={authUtils.getHomePath()}
              render={() => <Redirect to={getRootRedirect(newModules)}></Redirect>}
            />
          )}
          {newModules.map((item, index) => {
            return (
              <Route
                key={index}
                path={item.path}
                component={Bundle(pageComponents[oldIndexs[index]])}
              />
            );
          })}
          <Route component={NotFound} />
        </Switch>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};
export default Layout;
