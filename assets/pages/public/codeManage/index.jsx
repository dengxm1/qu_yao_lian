import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ChainCode from './chainCode'; // 追溯码中心
import EmptyCode from './emptyCode'; // 领取空码
import Relevance from './relevance'; //包装关联
import './index.less';

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const codeManage = () => {
  return (
    <Switch>
      <Route exact path={routerPrefix + '/public/codeManage/emptyCode'} component={EmptyCode} />
      <Route exact path={routerPrefix + '/public/codeManage/relevance'} component={Relevance} />
      <Route exact path={routerPrefix + '/public/codeManage/chainCode'} component={ChainCode} />
    </Switch>
  );
};

export default codeManage;
