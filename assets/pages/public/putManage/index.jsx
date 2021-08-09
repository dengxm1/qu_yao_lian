import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProductOrder from './productOrder/index'; //待入库
import ProductRegisterSimple from './productRegisterSimple/index'; //自产药品入库
import ProductRegister from './productRegister/index'; //流通药品入库

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const PutManage = () => {
  return (
    <Switch>
      <Route
        exact
        path={routerPrefix + '/public/putManage/productOrder'}
        component={ProductOrder}
      />
      <Route
        exact
        path={routerPrefix + '/public/putManage/productRegisterSimple'}
        component={ProductRegisterSimple}
      />
      <Route
        exact
        path={routerPrefix + '/public/putManage/productRegister'}
        component={ProductRegister}
      />
    </Switch>
  );
};

export default PutManage;
