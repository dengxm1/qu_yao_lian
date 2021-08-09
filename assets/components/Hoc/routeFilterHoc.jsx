import routerPath from 'router/routerPath';

export default (WrappedComponent) => {
  console.info('首次访问路由拦截是否已登录');

  const getCookie = (key) => {
    var arr1 = document.cookie.split('; ');
    for (var i = 0; i < arr1.length; i++) {
      var arr2 = arr1[i].split('=');
      if (arr2[0] == key) {
        return decodeURI(arr2[1]);
      }
    }
  };

  return class extends WrappedComponent {
    render() {
      const { pathname } = window.location;
      const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
      // eslint-disable-next-line no-debugger
      // debugger;

      if (pathname === routerPath.app.loginTest) {
        return super.render();
      }
      if (pathname === routerPath.app.proCityLetCode) {
        return super.render();
      }
      if (pathname.includes(routerPath.app.code)) {
        return super.render();
      }
      if (
        pathname !== routerPath.app.login &&
        pathname.indexOf('/gtin') == -1 &&
        !window.sessionStorage.getItem('tokenId') &&
        !companyInfo
      ) {
        window.location.pathname = routerPath.app.login;
      }
      return super.render();
    }
  };
};
