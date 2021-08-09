const utils = {
  getQueryString: (search, name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    }
    return null;
  },

  isNullOrEmpty: (obj) => {
    if (!obj || obj.length == 0) {
      return true;
    }
    if (obj instanceof Object) {
      for (let k in obj) {
        if (obj[k]) {
          return false;
        }
      }
      return true;
    }
    return false;
  },

  //姓名脱敏
  noPassByName: (str) => {
    if (null != str && str != undefined) {
      if (str.length <= 3) {
        return '*' + str.substring(1, str.length);
      } else if (str.length > 3 && str.length <= 6) {
        return '**' + str.substring(2, str.length);
      } else if (str.length > 6) {
        return str.substring(0, 2) + '****' + str.substring(6, str.length);
      }
    } else {
      return '';
    }
  },

  //手机号脱敏
  noPassByMobile: (str) => {
    if (null != str && str != undefined) {
      const pat = /(\d{3})\d*(\d{4})/;
      return str.replace(pat, '$1****$2');
    } else {
      return '';
    }
  },

  //身份证号脱敏
  noPassByCode: (str) => {
    if (null != str && str != undefined) {
      const pat = /(\d{1})\d*(\d{8})\d*(\d|X|x)/;
      return str.replace(pat, '$1***$2*****$3');
    } else {
      return '';
    }
  },

  // 身份证合法判断
  isIdCardLegal: function(idCard) {
    const regIdCard = /(^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
    if (idCard && regIdCard.test(idCard)) {
      if (idCard.length == 18) {
        const idCardWeight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 前17位的权重因子
        const idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 除以11之后可能产生的11位余数、验证码
        let idCardWiSum = 0;
        for (let i = 0; i < idCardWeight.length; i++) {
          idCardWiSum += Number(idCard.charAt(i)) * idCardWeight[i];
        }
        const idCardLast = idCard[17];
        const idCardMod = idCardWiSum % 11;
        // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
        if (idCardMod == 2) {
          if (idCardLast.toUpperCase() == 'X') {
            return true;
          } else {
            return false;
          }
        } else {
          if (idCardLast == idCardY[idCardMod]) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  // 证件类型、证件号码验证
  idNumberCheck: function(strType, strNum) {
    // 身份证 最后一位X需要大写
    var idCard = /^(^\d{18}$|^\d{17}(\d|X))$/;
    //港澳通行证验证、回乡证
    var hgIdCrad = /^[HM]{1}([0-9]{10}|[0-9]{8})$/;
    //台胞证验证
    var tbIdCrad = /(^\d{8})$/;
    // 居民身份证验证
    if (strType === '居民身份证') {
      // 格式验证通过后校验最后一位校验码
      if (idCard.test(strNum)) {
        // 身份证前17位 Ai * Wi
        var sum = 0;
        // 身份证前17位权重乘值
        var eachWeight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验码
        var testCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        for (var i = 0; i < strNum.length - 1; i++) {
          sum += parseInt(strNum.substr(i, 1)) * eachWeight[i];
        }
        // 加权结果对11取模
        var mod = sum % 11;
        return strNum.substr(strNum.length - 1) === testCode[mod];
      } else {
        return false;
      }
    } else if (strType === '港澳通行证') {
      return hgIdCrad.test(strNum);
    } else if (strType === '台胞证') {
      return tbIdCrad.test(strNum);
    }
    return true;
  },
  //18位统一社会信用代码校验
  handleCheckTpl: function(rule, value, callback) {
    let patrn = /^[0-9A-Z]+$/;
    try {
      if (value) {
        if (value.length != 18 || patrn.test(value) == false) {
          return Promise.reject('不是有效的统一社会信用编码！');
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    } catch (err) {
      return Promise.resolve();
    }
  },
  //手机号校验
  handleCheckPhone: function(rule, value, callback) {
    let patrn = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,2,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$|^[0][1-9]{2,3}-[0-9]{5,10}$/;
    try {
      if (value) {
        if (patrn.test(value) == false) {
          return Promise.reject('手机号格式错误！');
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    } catch (err) {
      return Promise.resolve();
    }
  },
  //药品本位码14位数字校验
  handleCheckStandardCode: function(rule, value, callback) {
    let patrn = /^[0-9]+$/;
    try {
      if (value) {
        if (value.length != 14 || patrn.test(value) == false) {
          return Promise.reject('不是有效的药品本位码！');
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    } catch (err) {
      return Promise.resolve();
    }
  },
  //药品条码13位数字校验
  handleCheckBarcode: function(rule, value, callback) {
    let patrn = /^[0-9]+$/;
    try {
      if (value) {
        if (value.length != 13 || patrn.test(value) == false) {
          return Promise.reject('不是有效的药品条码！');
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    } catch (err) {
      return Promise.resolve();
    }
  },
  //小数点校验为3位
  printDigit: function(price) {
    price = price.replace(/^\./g, ''); //验证第一个字符是.字
    price = price.replace(/\.{2,}/g, '.'); //只保留第一个, 清除多余的
    price = price.replace(/^0+\./, '0.');
    price = price.replace(/^0+([0-9])/, '$1');
    if (parseFloat(price) < 0) {
      price = price.replace(/[^\d.]/g, '');
    }
    if (price.indexOf('.') == 0) {
      //'首位小数点情况'
      price = price.replace(/[^$#$]/g, '0.');
      price = price.replace(/\.{2,}/g, '.');
    }
    let maxlength = price.indexOf('.') + 4;
    if (maxlength !== 3) {
      price = price.substring(0, maxlength);
      const is_num = price.split('.').length;
      if (is_num > 2) {
        price = price
          .split('.')
          .splice(0, 2)
          .join('.');
      }
    }
    return price;
  },
  //将提交的数据转化为formdata格式
  formdata: function(obj = {}) {
    let result = '';
    for (let name of Object.keys(obj)) {
      let value = obj[name];
      result +=
        '\r\n--XXX' +
        '\r\nContent-Disposition: form-data; name="' +
        name +
        '"' +
        '\r\n' +
        '\r\n' +
        value;
    }
    return result + '\r\n--XXX--';
  }
};
export default utils;
