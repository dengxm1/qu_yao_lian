import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './home'; //首页
import Problem from './problem/problem'; //常见问题
import Resources from './resources/resources'; //信息公告
import News from './news/news'; //企业消息
import Detail from './detail/detail'; //文章详情页查看

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const Home = () => {
  return (
    <Switch>
      <Route exact path={routerPrefix + '/public'} component={HomePage} />
      <Route exact path={routerPrefix + '/public/home'} component={HomePage} />
      <Route exact path={routerPrefix + '/public/home/news'} component={News} />
      <Route exact path={routerPrefix + '/public/home/resources'} component={Resources} />
      <Route exact path={routerPrefix + '/public/home/problem'} component={Problem} />
      <Route exact path={routerPrefix + '/public/home/detail'} component={Detail} />
    </Switch>
  );
};

export default Home;
