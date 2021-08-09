import axios from 'axios';
import { message } from 'antd';
import routerPath from 'router/routerPath';
import authUtils from './authUtils';

// 创建axios实例
// axios.defaults.withCredentials = true;
const service = axios.create({
  withCredentials: true,
  timeout: 100000, // 请求超时时间
  baseURL:
    globalConfig && globalConfig.apiPrefix
      ? process.env.PLACE === 'wuhan'
        ? globalConfig.apiPrefix.ellApi
        : globalConfig.apiPrefix.default
      : '/api' //请求前缀，根据实际情况修改
  // crossDomain: true
});

const setCookie = (key, value, t) => {
  var myDate = new Date();
  myDate.setDate(myDate.getDate() + t);
  document.cookie = key + '=' + value + ';expires=' + myDate.toGMTString();
};

// request拦截器
service.interceptors.request.use(
  (config) => {
    nprogressUtils.start();
    let tokenId = authUtils.getTokenId();
    if (typeof tokenId == 'undefined') {
      tokenId = '';
    }
    config.headers = {
      'Content-Type': 'application/json;charset=utf-8'
      // 'Access-Control-Allow-Origin': 'Origin',
      // 'Access-Control-Request-Method': 'POST, GET, OPTIONS, DELETE',
      // 'Access-Control-Request-Headers':
      //   'Content-Disposition,Origin, X-Requested-With, Content-Type, Accept,Authorization'
      // withCredentials: true
      // Authorization: tokenId,
      // crossDomain: true
    };
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  (response) => {
    nprogressUtils.done();
    if (response.data.code === '904') {
      message.info(response.data.message, 2, () => {
        sessionStorage.removeItem('companyInfo');
        sessionStorage.removeItem('userInfo');
        setCookie('JSESSIONID', '', -1);
        window.location.pathname = routerPath.app.login;
      });
    } else {
      return response;
    }
  },
  (error) => {
    nprogressUtils.done();
    console.log('err', error); // for debug
    message.error(error.message, 3);
    return Promise.reject(error);
  }
);

export default service;
