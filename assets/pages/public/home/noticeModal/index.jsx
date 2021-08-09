import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import AdminApi from 'api/admin.js';
import loginApi from 'api/login';
import './index.less';

const NoticeModal = (props) => {
  const { visible, content } = props;
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const [isVisible, setIsVisible] = useState(visible);

  const handleClose = () => {
    AdminApi.cleanNotice().then((res) => {
      loginApi.getUserInfo({ userId: userInfo.id }).then((res) => {
        if (res?.data?.data) {
          setIsVisible(res.data.data.noticeId);
          sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
          sessionStorage.setItem('companyInfo', JSON.stringify(res.data.data));
        }
      });
    });
  };
  return (
    <Modal
      visible={isVisible}
      onCancel={handleClose}
      footer={
        <div>
          <Button onClick={handleClose}>关闭</Button>
        </div>
      }
    >
      <h3 style={{ marginBottom: 10, textAlign: 'center' }}>{name}</h3>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </Modal>
  );
};
export default NoticeModal;
