import routerPath from '../router/routerPath';
// import React, { useEffect, useState } from 'react';
import loginApi from '../api/login';
import SystemApi from 'api/system.js';

const authUtils = (() => {
  // const modules = JSON.parse(sessionStorage.getItem('modules'));
  // console.log('modules', modules);
  const { app, modTypes, modules, modules1 } = routerPath;
  const storageKeys = [
    'tokenId',
    'userName',
    'companyId',
    'companyName',
    'uniformCode',
    'superAdmin'
    // 'userInfo'
  ];
  let moduleRoles = { newModules: [], oldIndexs: [] };
  let userRoles = [];

  return {
    login: (data) => {
      sessionStorage.setItem(storageKeys[0], data.tokenId);
      // sessionStorage.setItem(storageKeys[1], data.userInfo.username);
      window.location.href = app.root;
    },

    getModules: (data) => {
      sessionStorage.setItem('modules', JSON.stringify(data));
    },

    loginTest: (data) => {
      sessionStorage.setItem(storageKeys[4], data.uniformCode);
      sessionStorage.setItem(storageKeys[5], data.superAdmin);
      // sessionStorage.setItem(storageKeys[6], data && JSON.stringify(data));
      window.location.href = app.root;
    },
    setCookie: (key, value, t) => {
      var myDate = new Date();
      myDate.setDate(myDate.getDate() + t);
      document.cookie = key + '=' + value + ';expires=' + myDate.toGMTString();
    },
    logout: () => {
      sessionStorage.removeItem('companyInfo');
      sessionStorage.removeItem('tokenId');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('videoToken');
      sessionStorage.removeItem('modules');

      authUtils.setCookie('JSESSIONID', '', -1);
      window.location.pathname = routerPath.app.login;
    },

    getUserName: () => {
      return sessionStorage.getItem(storageKeys[1]);
    },

    getCompanyName: () => {
      return sessionStorage.getItem(storageKeys[3]);
    },

    getTokenId: () => {
      return sessionStorage.getItem(storageKeys[0]);
    },

    getUserInfo: () => {
      return sessionStorage.getItem(storageKeys[6]);
    },

    setModuleRoles: (data) => {
      authUtils.clearModuleRoles();
      const modules = JSON.parse(sessionStorage.getItem('modules'));
      if (data) {
        userRoles = data;
        moduleRoles.newModules.push({
          title: '业务管理',
          path: '/public',
          name: 'public',
          children: []
        });
        for (let i in modules[0].children) {
          if (data.find((item) => item.modName === modules[0].children[i].name)) {
            moduleRoles.newModules[0].children.push(modules[0].children[i]);
            moduleRoles.oldIndexs.push(i);
          }
        }
      }
    },

    clearModuleRoles: () => {
      moduleRoles.newModules.length = 0;
      moduleRoles.oldIndexs.length = 0;
    },

    getModuleRoles: () => {
      return moduleRoles;
    },

    getSubModules: (name) => {
      let mod = { path: '', children: [], oldIndexs: [] };
      let module = moduleRoles.newModules.find((item) => item.name === name);
      let modRole = userRoles.find((item) => item.modName === name);

      if (module) {
        mod.path = module.path;
        let children = module.children;
        let childrenRole = modRole.children;
        if (children && childrenRole) {
          for (let i in children) {
            if (childrenRole.find((item) => item.modName === children[i].name)) {
              mod.children.push(children[i]);
              mod.oldIndexs.push(i);
            }
          }
        }
      }

      return mod;
    },

    getHomePath: () => {
      return app.root;
    },

    getLoginPath: () => {
      return app.login;
    },

    getPrivactPath: () => {
      return app.proCityLetCode;
    },

    getModTypes: () => {
      return modTypes;
    },

    clearStorage: () => {
      storageKeys.map((k) => window.sessionStorage.removeItem(k));
    },

    /*=============以下方法测试使用===============*/
    testLogin: (data) => {
      sessionStorage.setItem(storageKeys[0], 'testid20190101');
      sessionStorage.setItem(storageKeys[1], data.username);
      window.location.href = app.root;
    },

    testSetModuleRoles: (modules) => {
      authUtils.clearModuleRoles();
      // const modules = JSON.parse(sessionStorage.getItem('modules'));

      if (modules) {
        for (let i in modules) {
          moduleRoles.newModules.push(modules[i]);
          moduleRoles.oldIndexs.push(i);
        }
      }
    },

    testGetSubModules: (name) => {
      let mod = { path: '', children: [], oldIndexs: [] };
      let module = moduleRoles.newModules.find((item) => item.name === name);
      if (module) {
        mod.path = module.path;
        let children = module.children;
        if (children) {
          for (let i in children) {
            mod.children.push(children[i]);
            mod.oldIndexs.push(i);
          }
        }
      }
      return mod;
    }
  };
})();

export default authUtils;
