import React, { useEffect, useState } from 'react';
import Content from 'components/Content';

import Home from 'bundle-loader?lazy&name=home!./home';
import InformFilling from 'bundle-loader?lazy&name=productionUnit!./informFilling';
import PutManage from 'bundle-loader?lazy&name=putManage!./putManage';
import DetectionManage from 'bundle-loader?lazy&name=detectionManage!./detectionManage';
import CodeManage from 'bundle-loader?lazy&name=codeManage!./codeManage';
import OutManage from 'bundle-loader?lazy&name=outManage!./outManage';
import SaleReturn from 'bundle-loader?lazy&name=salesReturn!./salesReturn';
import StockManage from 'bundle-loader?lazy&name=stockManage!./stockManage';
import CompanyManage from 'bundle-loader?lazy&name=companyManage!./companyManage';
import Admin from 'bundle-loader?lazy&name=codeManger!./admin';

import './index.less';

const pageComponents = [
  {
    name: 'Home',
    page: Home
  },
  {
    name: 'InformFilling',
    page: InformFilling
  },
  {
    name: 'PutManage',
    page: PutManage
  },
  {
    name: 'DetectionManage',
    page: DetectionManage
  },
  {
    name: 'CodeManage',
    page: CodeManage
  },
  {
    name: 'OutManage',
    page: OutManage
  },
  {
    name: 'SaleReturn',
    page: SaleReturn
  },
  {
    name: 'StockManage',
    page: StockManage
  },
  {
    name: 'CompanyManage',
    page: CompanyManage
  },
  {
    name: 'Admin',
    page: Admin
  }
];

const Public = () => {
  const [pageData, setPageData] = useState([]);
  useEffect(() => {
    let modules = JSON.parse(sessionStorage.getItem('modules'))[0].children;
    let names = [];
    let pages = [];
    modules.map((ele, index) => {
      names.push(ele.name);
      pageComponents.map((e, i) => {
        if (e.name == ele.name) {
          pages.push(e.page);
        }
      });
    });
    setPageData(pages);
  }, []);
  return <Content name="public" pageComponents={pageData} />;
};
export default Public;
