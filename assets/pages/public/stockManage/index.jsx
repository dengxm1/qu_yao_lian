import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Product from './product/index'; // 自产药品库存
import Commodity from './commodity/index'; // 流通药品库存

import ProductDetail from './product/inventoryDetail';
import CommodityDetail from './commodity/inventoryDetail';

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const StockManage = () => {
  return (
    <Switch>
      <Route exact path={routerPrefix + '/public/stockManage/product'} component={Product} />
      <Route exact path={routerPrefix + '/public/stockManage/commodity'} component={Commodity} />
      <Route
        exact
        path={routerPrefix + '/public/stockManage/product/productDetail'}
        component={ProductDetail}
      />
      <Route
        exact
        path={routerPrefix + '/public/stockManage/commodity/commodityDetail'}
        component={CommodityDetail}
      />
    </Switch>
  );
};

export default StockManage;
