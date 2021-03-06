import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Header from 'components/Header';
import Bundle from 'router/bundle';
import NotFound from 'components/NotFound';
import NoAccess from 'components/NoAccess';
import Privacy from 'bundle-loader?lazy&name=mod1!pages/privacy';
// import loginApi from 'api/login';
import authUtils from 'utils/authUtils';
import './index.less';

//按路由访问顺序
const pageComponents = [Privacy];

const Layout1 = () => {
  const [renderKey, setRenderKey] = useState(0);

  const { newModules, oldIndexs } = authUtils.getModuleRoles();

  const getRootRedirect = (modules) => {
    if (modules[0].path === window.location.pathname && modules[0].children) {
      return modules[0].children[0].path;
    }
    return modules[0].path;
  };

  const getQueryParams = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return '';
  };

  //TODO 测试使用
  authUtils.testSetModuleRoles();

  useEffect(() => {
    //正式上线启用
    /* loginApi.getModuleRoles({ 'modtypes': authUtils.getModTypes() }).then(res => {
      if (res && res.data.data) {
        authUtils.setModuleRoles(res.data.data);
        setRenderKey(renderKey + 1);
      }
    }) */
  }, []);

  return (
    <div className="container">
      <Header key={renderKey} modules={newModules} />
      {newModules.length > 0 ? (
        <Switch>
          {/* {authUtils.getHomePath() === getRootRedirect(newModules) ? null : (
            <Route
              exact
              path={authUtils.getHomePath()}
              render={() => <Redirect to={getRootRedirect(newModules)}></Redirect>}
            />
          )} */}
          {newModules.map((item, index) => (
            <Route
              key={index}
              path={item.path}
              component={Bundle(pageComponents[oldIndexs[index]])}
            />
          ))}
          <Route component={NotFound} />
        </Switch>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};
export default Layout1;
