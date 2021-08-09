import { message } from 'antd';

export const rules = {
  isPhone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
};
export const isDev = process.env.NODE_ENV === 'development';

export const randomKey = () => {
  return Math.random()
    .toString(32)
    .substr(2);
};

export const dataValidation = (data, rules) => {
  let isError = false;
  for (let key in rules) {
    if (typeof rules[key] === 'function' && !isError) {
      if (rules[key](data[key])) {
        message.error(rules[key](data[key]));
        isError = true;
      } else {
        isError = false;
      }
    } else if (
      typeof rules[key] === 'string' &&
      !data[key] &&
      data[key] !== 0 &&
      String(data[key]) !== 'false' &&
      !isError
    ) {
      message.error(rules[key]);
      isError = true;
    }
  }
  return isError;
};
