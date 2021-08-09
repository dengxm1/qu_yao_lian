import React from 'react';
import { Route, Switch } from 'react-router-dom';
import OutRegister from './outRegister/index'; // 出库登记
// import SalesReturn from './salesReturn/index'; //退货记录
import './index.less';

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const OutManage = () => {
  return (
    <Switch>
      <Route exact path={routerPrefix + '/public/outManage/outRegister'} component={OutRegister} />
      {/* <Route exact path={routerPrefix + '/public/outManage/saleReturn'} component={SalesReturn} /> */}
    </Switch>
  );
};

export default OutManage;
