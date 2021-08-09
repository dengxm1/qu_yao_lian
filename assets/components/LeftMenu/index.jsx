import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Menu } from 'antd';
import routerPath from 'router/routerPath';
import home from '../../public/imgs/menuLogo/home.png';
import message from '../../public/imgs/login/message.png';
import register from '../../public/imgs/menuLogo/register.png';
import ai from '../../public/imgs/menuLogo/ai.png';
import informFilling from '../../public/imgs/menuLogo/informFilling.png';
import product from '../../public/imgs/menuLogo/product.png';
import video from '../../public/imgs/menuLogo/video.png';
import feel from '../../public/imgs/menuLogo/feel.png';
import testImage from '../../public/imgs/menuLogo/testImage.png';
import admin from '../../public/imgs/menuLogo/admin.png';
import codeImg from '../../public/imgs/menuLogo/code.png';
import inventory from '../../public/imgs/menuLogo/inventory.png';
import employeeManagement from '../../public/imgs/employeeManagement.png';
import cx from 'classnames';
import './index.less';

const { SubMenu } = Menu;
let currOpenKeys = [];

@inject('Breadcrumb', 'UI', 'NavTabs', 'ContentOpera')
@observer
class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.menuData = this.props.data;
    this.crumbValues = [];
    this.operaDesValues = null;
  }

  componentDidMount() {
    this.props.Breadcrumb.setValue(1, this.crumbValues);
    this.props.ContentOpera.setValue(1, this.operaDesValues);
  }

  toggleCollapsed = () => {
    this.props.UI.toggleCollapsed();
  };

  handleClick = (menuItem) => {
    const { keyPath } = menuItem;
    const top = document.getElementById('left-menu-page').scrollTop;
    if (top) {
      const a = setTimeout(() => {
        document.getElementById('left-menu-page').scrollTo(0, top);
        clearTimeout(a);
      }, 0);
    }
    this.props.history.push(keyPath[0]);
  };

  setOpenKeys = (keys) => {
    currOpenKeys = keys;
  };
  getOperaType = (selectMenuArr) => {};

  getActiveMenu = (menuData) => {
    const menuProps = { openMenuArr: [], selectMenuArr: [] };
    const currentPath = window.location.pathname + '/';
    if (menuData.length > 0) {
      let menuDataItem = menuData.find((item) => {
        return currentPath.indexOf(item.path + '/') !== -1;
      });
      if (!menuDataItem) {
        [menuDataItem] = menuData;
      }
      const { path, title } = menuDataItem;
      if (menuDataItem.children) {
        menuProps.openMenuArr.push({ path, title });
        const subMenuProps = this.getActiveMenu(menuDataItem.children);
        menuProps.openMenuArr = menuProps.openMenuArr.concat(subMenuProps.openMenuArr);
        if (subMenuProps.selectMenuArr.length > 0) {
          menuProps.selectMenuArr = menuProps.selectMenuArr.concat(subMenuProps.selectMenuArr);
        } else {
          menuProps.selectMenuArr.push({ path, title });
        }
      } else {
        menuProps.selectMenuArr.push({ path, title });
      }
    }

    return menuProps;
  };

  renderMenu = (value) => {
    const menuArray = [];
    const { path, title, icon, children } = value;
    if (children && children.length > 0) {
      const subChildren = children.map(this.renderMenu);
      menuArray.push(
        <SubMenu
          key={path}
          className="menuItem"
          title={
            <span>
              {icon === 'home' ? (
                <img src={home} />
              ) : icon === 'message' ? (
                <img src={message} />
              ) : icon === 'register' ? (
                <img src={register} />
              ) : icon === 'inventory' ? (
                <img src={inventory} />
              ) : icon === 'code' ? (
                <img src={codeImg} />
              ) : icon === 'testImage' ? (
                <img src={testImage} />
              ) : icon === 'product' ? (
                <img src={product} />
              ) : icon === 'admin' ? (
                <img src={admin} />
              ) : icon === 'video' ? (
                <img src={video} />
              ) : icon === 'ai' ? (
                <img src={ai} />
              ) : icon === 'informFilling' ? (
                <img src={informFilling} />
              ) : icon === 'employeeManagement' ? (
                <img src={employeeManagement} />
              ) : (
                ''
              )}
              <span>{title}</span>
            </span>
          }
        >
          {subChildren}
        </SubMenu>
      );
    } else {
      menuArray.push(
        <Menu.Item
          className="menuItem"
          key={path}
          disabled={path === routerPath.app.proCityLetCode}
        >
          <span>
            {icon === 'home' ? (
              <img src={home} />
            ) : icon === 'message' ? (
              <img src={message} />
            ) : icon === 'register' ? (
              <img src={register} />
            ) : icon === 'inventory' ? (
              <img src={inventory} />
            ) : icon === 'code' ? (
              <img src={codeImg} />
            ) : icon === 'testImage' ? (
              <img src={testImage} />
            ) : icon === 'product' ? (
              <img src={product} />
            ) : icon === 'admin' ? (
              <img src={admin} />
            ) : icon === 'video' ? (
              <img src={video} />
            ) : icon === 'ai' ? (
              <img src={ai} />
            ) : icon === 'informFilling' ? (
              <img src={informFilling} />
            ) : icon === 'feel' ? (
              <img src={feel} />
            ) : icon === 'employeeManagement' ? (
              <img src={employeeManagement} />
            ) : (
              ''
            )}
            <span>{title}</span>
          </span>
        </Menu.Item>
      );
    }
    return menuArray;
  };

  render() {
    const { collapsed } = this.props.UI;
    const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
    const { openMenuArr, selectMenuArr } = this.getActiveMenu(this.menuData);
    this.crumbValues = openMenuArr.concat(selectMenuArr);
    this.operaDesValues = selectMenuArr[0];
    const openKeyArr = openMenuArr.map((v) => v.path);
    const selectKeyArr = selectMenuArr.map((v) => v.path);
    if (currOpenKeys.length === 0 && openKeyArr.length > 0) {
      this.setOpenKeys(openKeyArr);
    }
    const currentPathObj = this.crumbValues[this.crumbValues.length - 1];
    this.props.NavTabs.setDataList(currentPathObj);
    return (
      <div
        className={cx({
          'left-menu': true,
          'left-menu-collapsed': collapsed === true
        })}
      >
        {/* <div className="open-menu" onClick={this.toggleCollapsed}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </div> */}
        <div className="title_version">
          <span>衢药安链</span>
          <span>v1.0.0</span>
        </div>
        <Menu
          defaultSelectedKeys={selectKeyArr}
          defaultOpenKeys={currOpenKeys}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          inlineIndent={15}
          onOpenChange={this.setOpenKeys}
          onClick={this.handleClick}
          id="left-menu-page"
        >
          {this.menuData && this.menuData.map(this.renderMenu)}
        </Menu>
      </div>
    );
  }
}
export default withRouter(LeftMenu);
