import React from 'react';
// 多语言
import { ConfigProvider, message } from 'antd';
// import { IntlProvider, addLocaleData } from 'react-intl';
/*
 *引入与navigator.languages[0]所对应的语言；
 *如果没有引入对应的语言，会使用默认的“en”；
 *导致FormattedMessage的映射不会成功；
 */
// import zh from 'react-intl/locale-data/zh';
// import en from 'react-intl/locale-data/en';
import indexApi from 'api/api';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import messages from './lang/index';
import Login from 'bundle-loader?lazy&name=login!pages/login/indexTest';
import LoginTest from 'bundle-loader?lazy&name=login!pages/login/index';
import Layout from 'bundle-loader?lazy&name=layout!pages/layout/index';
import ScanCode from 'pages/scanCode';

import routerPath from './router/routerPath';
import Bundle from './router/bundle';
import RouterHoc from './components/Hoc/routeFilterHoc';
import PersonMessage from 'bundle-loader?lazy&name=personMessage!pages/personMessage/index';
import Apply from 'bundle-loader?lazy&name=apply!pages/apply/index';

// addLocaleData([...zh, ...en]);
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('en');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: zhCN
    };
  }

  componentDidMount() {
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    const pathname = window.location.href;
    const isScan = pathname.indexOf('gtin') || pathname.indexOf('/login');
  }

  componentWillMount() {}

  render() {
    const fetchGlobalValue = () => {
      // if (!sessionStorage.getItem('globalValue')) {
      indexApi.getDirctionaryMap('global').then((res) => {
        if (res.data.code === '0') {
          if (localStorage.getItem('globalValue') !== JSON.stringify(res.data.data)) {
            localStorage.setItem('globalValue', JSON.stringify(res.data.data));
          }
        } else {
          message.error(res.data.msg);
        }
      });
      // }
    };

    return (
      <ConfigProvider locale={this.state.locale}>
        <BrowserRouter>
          <Switch>
            <Switch>
              <Route exact path={routerPath.app.login} component={Bundle(Login)} />
              <Route exact path={routerPath.app.loginTest} component={Bundle(LoginTest)} />
              <Route exact path={routerPath.app.personMessage} component={Bundle(PersonMessage)} />
              <Route exact path={routerPath.app.apply} component={Bundle(Apply)} />
              <Route path={routerPath.app.root} component={Bundle(Layout)} />
              <Route path={'/gtin/:gtin/bat/:bat'} component={ScanCode} />
              <Route path={'/gtin/:gtin'} component={ScanCode} />
              <Route exact path={'/:code'} component={ScanCode} />
            </Switch>
          </Switch>
        </BrowserRouter>
      </ConfigProvider>
    );
  }
}
export default RouterHoc(App);
