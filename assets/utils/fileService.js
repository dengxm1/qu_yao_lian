import axios from 'axios';
import { message } from 'antd';
import routerPath from 'router/routerPath';
import authUtils from './authUtils';

// 创建axios实例
// axios.defaults.withCredentials = true;
const fileService = axios.create({
  timeout: 60000, // 请求超时时间
  baseURL:
    globalConfig && globalConfig.apiPrefix
      ? process.env.PLACE === 'wuhan'
        ? globalConfig.apiPrefix.ellApi
        : globalConfig.apiPrefix.default
      : '/api', //请求前缀，根据实际情况修改
  withCredentials: true,
  responseType: 'blob'
});

const setCookie = (key, value, t) => {
  var myDate = new Date();
  myDate.setDate(myDate.getDate() + t);
  document.cookie = key + '=' + value + ';expires=' + myDate.toGMTString();
};

// request拦截器
fileService.interceptors.request.use(
  (config) => {
    nprogressUtils.start();
    let tokenId = authUtils.getTokenId();
    if (typeof tokenId == 'undefined') {
      tokenId = '';
    }
    config.headers = {
      Accept: 'application/octet-stream, application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': 'Origin',
      Authorization: tokenId
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
fileService.interceptors.response.use(
  (response) => {
    nprogressUtils.done();
    if (response.data.code === '904') {
      message.info(response.data.message, 2, () => {
        sessionStorage.removeItem('tokenId');
        sessionStorage.removeItem('userName');
        setCookie('JSESSIONID', '', -1);
        window.location.pathname = routerPath.app.login;
      });
    } else {
      const data = response.data;
      if (data.type === 'application/octet-stream') {
        let fileName = '';
        let downLoadName = '';
        if (fileName === '') {
          let contentDisposition = response.headers['content-disposition'];
          if (
            contentDisposition &&
            contentDisposition !== 'undefined' &&
            /filename=.*/gi.test(contentDisposition)
          ) {
            downLoadName = contentDisposition.match(/filename=.*/gi)[0];
            downLoadName = downLoadName.split('=')[1];
            downLoadName = decodeURI(downLoadName);
          }
        }

        const blob = new Blob([data], {
          type: 'application/octet-stream'
        });
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
          window.navigator.msSaveBlob(blob, decodeURI(downLoadName));
        } else {
          // 创建新的URL并指向File对象或者Blob对象的地址
          const blobURL = window.URL.createObjectURL(blob);
          // 创建a标签，用于跳转至下载链接
          const tempLink = document.createElement('a');
          tempLink.style.display = 'none';
          tempLink.href = blobURL;
          tempLink.setAttribute('download', decodeURI(downLoadName));
          // 兼容：某些浏览器不支持HTML5的download属性
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
          }
          // 挂载a标签
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          // 释放blob URL地址
          window.URL.revokeObjectURL(blobURL);
        }
      } else if (data.type === 'application/json') {
        var reader = new FileReader();
        reader.onload = (e) => {
          console.log(JSON.parse(e.target.result));
          message.error(JSON.parse(e.target.result).message);
        };
        reader.readAsText(data, 'utf-8');
        return true;
      } else {
        return response;
      }
    }
  },
  (error) => {
    nprogressUtils.done();
    console.log('err', error); // for debug
    message.error(error.message, 3);
    return Promise.reject(error);
  }
);

export default fileService;
