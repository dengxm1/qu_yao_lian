const paths = {
  modTypes: 'source_code',
  app: {
    root: '/',
    login: '/login',
    loginTest: '/loginTest',
    personMessage: '/personMessage',
    apply: '/apply',
    scanCode: '/scanCode'
  },
  modules: [
    {
      id: null,
      name: 'public',
      type: 0,
      title: '业务管理',
      path: '/public',
      pid: null,
      icon: null,
      visible: null,
      children: [
        {
          id: 'cac941892c304df696bb37fa084e2d4c',
          name: 'Home',
          type: 0,
          title: '首页',
          path: '/public/home',
          pid: '1',
          icon: 'home',
          visible: true,
          children: [],
          isParent: false
        },
        {
          id: '6abf16b543f54ad7bb48098056f74e86',
          name: 'InformFilling',
          type: 0,
          title: '信息库',
          path: '/public/InformFilling',
          pid: '1',
          icon: 'informFilling',
          visible: true,
          children: [
            {
              id: '9582763a3db941d1a49bb991a8b74a14',
              name: 'ProductRecord',
              type: 0,
              title: '生产企业管理',
              path: '/public/InformFilling/productRecord',
              pid: '6abf16b543f54ad7bb48098056f74e86',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '33d21449e076403d97228864ce9e6aa7',
              name: 'ProductionUnit',
              type: 0,
              title: '供应商管理',
              path: '/public/InformFilling/productionUnit',
              pid: '6abf16b543f54ad7bb48098056f74e86',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '4315766f93f24157a1e66c4b6709a94a',
              name: 'Supplier',
              type: 0,
              title: '经销商管理',
              path: '/public/InformFilling/supplier',
              pid: '6abf16b543f54ad7bb48098056f74e86',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: 'c7c2a9ce7ec448639f3c3e149376114c',
              name: 'ProductRecordSimple',
              type: 0,
              title: '自产药品管理',
              path: '/public/InformFilling/productRecordSimple',
              pid: '6abf16b543f54ad7bb48098056f74e86',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '15d8e9f455524450a14c8c729e4551f2',
              name: 'CircleProductRecord',
              type: 0,
              title: '流通药品管理',
              path: '/public/InformFilling/circleProductRecord',
              pid: '6abf16b543f54ad7bb48098056f74e86',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            }
          ],
          isParent: false
        },
        {
          id: '92bbfd485cd14e2bb800f47530f99abf',
          name: 'PutManage',
          type: 0,
          title: '入库管理',
          path: '/public/putManage',
          pid: '1',
          icon: 'product',
          visible: true,
          children: [
            {
              id: '6b73c48c7e1c4c43aef57a0d944369e4',
              name: 'ProductRegisterSimple',
              type: 0,
              title: '自产药品入库',
              path: '/public/putManage/productRegisterSimple',
              pid: '92bbfd485cd14e2bb800f47530f99abf',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '9c8f8dc33e5a4a7fa9fa862ebe4917c1',
              name: 'ProductRegister',
              type: 0,
              title: '流通药品入库',
              path: '/public/putManage/productRegister',
              pid: '92bbfd485cd14e2bb800f47530f99abf',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '5d2103cc2e6e43de94c42e4e9305d036',
              name: 'ProductOrder',
              type: 0,
              title: '待入库',
              path: '/public/putManage/productOrder',
              pid: '92bbfd485cd14e2bb800f47530f99abf',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            }
          ],
          isParent: false
        },
        {
          id: 'dc17e5ab7083428bb5cfdc13261869b1',
          name: 'DetectionManage',
          type: 0,
          title: '检测管理',
          path: '/public/detectionManage',
          pid: '1',
          icon: 'testImage',
          visible: true,
          children: [],
          isParent: false
        },
        {
          id: '3faf00ffa4724ece80873e3ee7f479a2',
          name: 'CodeManage',
          type: 0,
          title: '样样赋码',
          path: '/public/codeManage',
          pid: '1',
          icon: 'code',
          visible: true,
          children: [
            {
              id: '1b680e2de6d3443b8abea0daaffa9f75',
              name: 'EmptyCode',
              type: 0,
              title: '申请空码',
              path: '/public/codeManage/emptyCode',
              pid: '3faf00ffa4724ece80873e3ee7f479a2',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '1b680e2de6d3443b8abea0daaffa9f78',
              name: 'Relevance',
              type: 0,
              title: '包装关联',
              path: '/public/codeManage/relevance',
              pid: '3faf00ffa4724ece80873e3ee7f479a2',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '1b680e2de6d3443b8abea0daaffa9f74',
              name: 'chainCode',
              type: 0,
              title: '追溯码中心',
              path: '/public/codeManage/chainCode',
              pid: '3faf00ffa4724ece80873e3ee7f479a2',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            }
          ],
          isParent: false
        },
        {
          id: '77ebdd1e76da4a49a7cb182b4ead47bf',
          name: 'OutManage',
          type: 0,
          title: '出库管理',
          path: '/public/outManage',
          pid: '1',
          icon: 'register',
          visible: true,
          children: [
            {
              id: 'c06e67d787e043fcb62dba394d5d14f4',
              name: 'OutRegister',
              type: 0,
              title: '销售出库',
              path: '/public/outManage/outRegister',
              pid: '77ebdd1e76da4a49a7cb182b4ead47bf',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            }
            // {
            //   id: '069243393d0c45958f072c91d7e7a9d8',
            //   name: 'SaleReturn',
            //   type: 0,
            //   title: '退货记录',
            //   path: '/public/outManage/saleReturn',
            //   pid: '77ebdd1e76da4a49a7cb182b4ead47bf',
            //   icon: '',
            //   visible: true,
            //   children: [],
            //   isParent: false
            // }
          ],
          isParent: false
        },
        {
          id: 'dc17e5ab7083428bb5cfdc13261869b3',
          name: 'SaleReturn',
          type: 0,
          title: '退货记录',
          path: '/public/saleReturn',
          pid: '1',
          icon: 'testImage',
          visible: true,
          children: [],
          isParent: false
        },
        {
          id: '069243393d0c45958f072c91d7e7a9d9',
          name: 'StockManage',
          type: 0,
          title: '库存管理',
          path: '/public/stockManage',
          pid: '1',
          icon: 'inventory',
          visible: true,
          children: [
            {
              id: 'e870281e6a674686bc523245d1978a8d',
              name: 'product',
              type: 0,
              title: '自产药品库存',
              path: '/public/stockManage/product',
              pid: '069243393d0c45958f072c91d7e7a9d9',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '661804d1a190472a9e97dd9b8fbfcdc8',
              name: 'commodity',
              type: 0,
              title: '流通药品库存',
              path: '/public/stockManage/commodity',
              pid: '069243393d0c45958f072c91d7e7a9d9',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            }
          ],
          isParent: false
        },
        {
          id: '2b2f45bcd73e401c8e2d8c131b97b455',
          name: 'CompanyManage',
          type: 0,
          title: '主体管理',
          path: '/public/companyManage',
          pid: '1',
          icon: 'product',
          visible: true,
          children: [
            {
              id: '75816e35a6d44f9f8569cff3854f0efa',
              name: 'MsgManage',
              type: 0,
              title: '主体信息管理',
              path: '/public/companyManage/msgManage',
              pid: '2b2f45bcd73e401c8e2d8c131b97b455',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            },
            {
              id: '7c43f0d20d444a88bdaa96731a0eaccd',
              name: 'AssistManage',
              type: 0,
              title: '辅助功能',
              path: '/public/companyManage/assistManage',
              pid: '2b2f45bcd73e401c8e2d8c131b97b455',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '45026d26e7604ed7a3feacf877acc380',
              name: 'CertifyManage',
              type: 0,
              title: '证照管理',
              path: '/public/companyManage/certifyManage',
              pid: '2b2f45bcd73e401c8e2d8c131b97b455',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            }
          ],
          isParent: false
        },
        {
          id: 'b0511788fce94be08ad6240892964b4e',
          name: 'Admin',
          type: 0,
          title: '后台管理',
          path: '/public/admin',
          pid: '1',
          icon: 'admin',
          visible: false,
          children: [
            {
              id: '3cd118c9706e45eda94dce3e3a755320',
              name: 'noticeManage',
              type: 0,
              title: '信息资源发布',
              path: '/public/admin/noticeManage',
              pid: 'b0511788fce94be08ad6240892964b4e',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            },
            {
              id: 'a0ab3a3493574f71869f96abc49ec7a6',
              name: 'companyManage',
              type: 0,
              title: '企业管理',
              path: '/public/admin/companyManage',
              pid: 'b0511788fce94be08ad6240892964b4e',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            },
            {
              id: '0bd5ff70dd4b46f8a3315cf87cb7485c',
              name: 'userManage',
              type: 0,
              title: '用户管理',
              path: '/public/admin/userManage',
              pid: 'b0511788fce94be08ad6240892964b4e',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            },
            {
              id: '8c16d341f28348aebaa1dc1c3ca1745a',
              name: 'roleManage',
              type: 0,
              title: '角色管理',
              path: '/public/admin/roleManage',
              pid: 'b0511788fce94be08ad6240892964b4e',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            },
            {
              id: '84956ac3e7934869864c240fb822ca4e',
              name: '/public/admin/loginLog',
              type: 0,
              title: '登录日志',
              path: '/public/admin/loginLog',
              pid: 'b0511788fce94be08ad6240892964b4e',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            },
            {
              id: '9ac8545524b147e9ba08009134a72e60',
              name: 'menuManage',
              type: 0,
              title: '菜单管理',
              path: '/public/admin/menuManage',
              pid: 'b0511788fce94be08ad6240892964b4e',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            },
            {
              id: 'b5cd6ec5ae6b4ddea1584c718e8ce6e7',
              name: 'ModuleManage',
              type: 0,
              title: '企业模板管理',
              path: '/public/admin/moduleManage',
              pid: 'b0511788fce94be08ad6240892964b4e',
              icon: '',
              visible: true,
              children: [],
              isParent: false
            },
            {
              id: '89a7b4ad34c54d2b8b17b71b87551642',
              name: 'dictionariesManage',
              type: 0,
              title: '字典管理',
              path: '/public/admin/dictionariesManage',
              pid: 'b0511788fce94be08ad6240892964b4e',
              icon: '',
              visible: false,
              children: [],
              isParent: false
            }
          ],
          isParent: false
        }
      ],
      isParent: false
    }
  ],
  modules1: [
    {
      title: '业务管理',
      path: '/privacy',
      name: 'privacy',
      children: [
        {
          title: '省市领码',
          path: '/privacy/proCityLetCode',
          name: 'proCityLetCode',
          icon: 'QrcodeOutlined'
        }
      ]
    }
  ]
};

let routerPrefix = process.env.APP_PREFIX;
routerPrefix = routerPrefix.substring(0, routerPrefix.length - 1);

const initAppPaths = function(obj) {
  // eslint-disable-next-line no-debugger
  // debugger;
  for (let key in obj) {
    if (obj[key] instanceof Object) {
      initAppPaths(obj[key]);
    } else {
      obj[key] = routerPrefix + obj[key];
    }
  }
};

const initModulesPaths = (obj) => {
  for (let key in obj) {
    if (obj[key] instanceof Object) {
      initModulesPaths(obj[key]);
    }
    if (obj[key].path) {
      obj[key].path = routerPrefix + obj[key].path;
    }
    if (
      obj[key].admin &&
      sessionStorage.getItem('superAdmin') !== '1' &&
      sessionStorage.getItem('menuAdmin') !== '1'
    ) {
      // 管理员菜单控制
      delete obj[key];
    }
  }
};

const initPaths = (obj) => {
  initAppPaths(obj['app']);
  initModulesPaths(obj['modules1']);
};

initPaths(paths);

export default paths;
