import React from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import Bundle from 'router/bundle';
import Breadcrumb from 'components/Breadcrumb';
import ContentOperaPage from 'components/ContentOpera';
import LeftMenu from 'components/LeftMenu';
import NoAccess from 'components/NoAccess';
import NotFound from 'components/NotFound';
import authUtils from 'utils/authUtils';
import systemApi from 'api/system.js';

import loginApi from 'api/login.js';
import './index.less';
import cx from 'classnames';

@inject('UI')
@observer
class Content extends React.Component {
  componentDidMount() {
    const typeList = JSON.parse(sessionStorage.getItem('typeList'));
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    if (!typeList) {
      systemApi.getValue({ type: 'raw_material_type' }).then((res) => {
        if (res?.data?.data) {
          sessionStorage.setItem('typeList', JSON.stringify(res.data.data.dataList));
        }
      });
    }
  }
  render() {
    const { collapsed } = this.props.UI;
    const { name, pageComponents } = this.props;
    const { path, oldIndexs } = authUtils.testGetSubModules(name);
    let children = authUtils.testGetSubModules(name).children;

    const isNoAccess = !children || children.length === 0;

    const getPageComponent = (index) => {
      if (pageComponents && pageComponents[index]) {
        return Bundle(pageComponents[index]);
      }
      if (isNoAccess) {
        return NoAccess;
      }
      return NotFound;
    };

    const { pathname } = location;

    const switchRoute = (
      <Switch>
        <Route exact path={path} component={getPageComponent(0)} />
        {children &&
          children.map((item, index) => (
            <Route key={index} path={item.path} component={getPageComponent(oldIndexs[index])} />
          ))}
      </Switch>
    );
    const paths =
      pathname !== `${path}/home` && pathname !== `${path}/home/news` && pathname !== `${path}`;

    return (
      <div className="bw-content">
        {!isNoAccess ? <LeftMenu data={children} /> : null}
        <div
          className={cx({
            'right-content': true,
            'right-content-collapsed': collapsed === true,
            'right-content-all': isNoAccess
          })}
        >
          {paths ? <Breadcrumb /> : null}
          {paths ? (
            <div className="content-content">
              <ContentOperaPage />
              {switchRoute}
            </div>
          ) : (
            switchRoute
          )}
        </div>
      </div>
    );
  }
}
export default Content;
