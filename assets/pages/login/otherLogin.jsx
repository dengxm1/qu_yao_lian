import React, { useState } from 'react';
import { isDev } from 'utils/common';
import './OtherLogin.less';

import pIcon from '../../public/imgs/login/icon-个人登陆normal.png';
import pIcon_active from '../../public/imgs/login/icon-个人登陆click.png';
import fIcon from '../../public/imgs/login/icon-法人登陆normal.png';
import fIcon_active from '../../public/imgs/login/icon-法人登陆click.png';

const host = location.protocol + '//' + location.host + '/login';
const isOfficial = process.env.ISOFFICIAL || false;

const OhterLogin = () => {
  const [current, setCurrent] = useState(null);

  const skipPage = (url) => {
    window.location.href = url;
  };

  return (
    <div className="ohterLogin-area">
      <div>微信扫码登录</div>
      <div className="navs" style={{ textAlign: 'center' }}>
        <img src={fIcon_active} />
      </div>
      <div className="register">请使用微信扫一扫登录</div>
    </div>
  );
};

export default OhterLogin;
