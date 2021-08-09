import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DetectionList from './detectionList/index'; //检测管理--列表页

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const DetectionManage = () => {
  return (
    <Switch>
      <Route exact path={routerPrefix + '/public/detectionManage'} component={DetectionList} />
    </Switch>
  );
};

export default DetectionManage;
