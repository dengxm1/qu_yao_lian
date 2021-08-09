import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProductRecord from './productRecord/index'; // 生产企业管理
import ProductionUnit from './productionUnit/index'; //供应商管理
import Supplier from './supplier/index'; //经销商管理
import ProductRecordSimple from './productRecordSimple/index'; // 自产药品管理
import CircleProductRecord from './circleProductRecord/index'; // 流通药品管理

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const InformFilling = () => {
  return (
    <Switch>
      <Route
        exact
        path={routerPrefix + '/public/informFilling/productRecord'}
        component={ProductRecord}
      />
      <Route
        exact
        path={routerPrefix + '/public/informFilling/productionUnit'}
        component={ProductionUnit}
      />
      <Route exact path={routerPrefix + '/public/informFilling/supplier'} component={Supplier} />
      <Route
        exact
        path={routerPrefix + '/public/informFilling/productRecordSimple'}
        component={ProductRecordSimple}
      />
      <Route
        exact
        path={routerPrefix + '/public/InformFilling/circleProductRecord'}
        component={CircleProductRecord}
      />
    </Switch>
  );
};

export default InformFilling;
