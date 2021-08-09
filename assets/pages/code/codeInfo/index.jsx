import React, { useState, useEffect } from 'react';
import { Timeline, Modal } from 'antd';
import './index.less';

const productInfo = [
  {
    name: '浙江省食品安全信息追溯企业平台（浙食链）',
    value: '202011307563441249',
    type: 1
  },
  {
    name: '核酸检测报告',
    value: ['http://localhost:8080/my/bg.gif', 'http://localhost:8080/my/科技圆圈.png'],
    type: 2
  }
];

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [openUrl, setOpenUrl] = useState('');

  const handleClickImg = (url) => {
    setOpenUrl('');
    setVisible(true);
    setOpenUrl(url);
  };

  return (
    <div className="content">
      <div className="codeHeader">
        <img src="http://localhost:8080/my/bg.gif" alt="" />
      </div>
      <div className="codeContent">
        <div className="codeCard">
          <div className="cardTitle">商品信息</div>
          <div className="cardContent">
            <div>
              <Timeline>
                {productInfo &&
                  productInfo.map((item, i) => {
                    if (item.type === 1) {
                      return (
                        <Timeline.Item key={i}>
                          <div style={{ display: 'flex' }}>
                            <span style={{ width: '50%' }}>{item.name}</span>
                            <span style={{ width: '50%' }}>{item.value}</span>
                          </div>
                        </Timeline.Item>
                      );
                    } else {
                      return (
                        <Timeline.Item key={i}>
                          <div style={{ display: 'flex' }}>
                            <span style={{ width: '50%' }}>{item.name}</span>
                            <div style={{ width: '50%' }}>
                              {item.value &&
                                item.value.map((val, index) => {
                                  return (
                                    <img
                                      src={val}
                                      key={index}
                                      onClick={() => handleClickImg(val)}
                                      style={{ width: '100%', marginBottom: 10 }}
                                    />
                                  );
                                })}
                            </div>
                          </div>
                        </Timeline.Item>
                      );
                    }
                  })}
              </Timeline>
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={visible}
        footer={null}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <img src={openUrl} style={{ width: '100%' }} />
      </Modal>
    </div>
  );
};

export default Index;
