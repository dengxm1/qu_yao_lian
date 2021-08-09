import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Button, message } from 'antd';
import './index.less';

const ReportModal = (props) => {
  const handleClose = (isData, data) => {
    props.onClose(isData, data);
  };
  return (
    <Modal
      visible={props.visible}
      title={props.isRegulatory ? '选择监管机构' : '选择监管仓'}
      width={800}
      destroyOnClose
      className="reportModel"
      onCancel={() => handleClose(false)}
    >
      <Row gutter={16} className="otherPopup">
        {props.dataList.length ? (
          props.dataList.map((item, i) => {
            return props.isRegulatory ? (
              <Col
                className="gutter-row"
                span={6}
                key={item.code}
                onClick={() => handleClose(true, item)}
              >
                <div className="popupWarehouse" style={{ textAlign: 'center' }}>
                  <span className="title">{item.djjgjc}</span>
                </div>
              </Col>
            ) : (
              <Col
                className="gutter-row"
                span={6}
                key={item.regulatoryWarehouseId}
                onClick={() => handleClose(true, item)}
              >
                <div className="popupWarehouse">
                  <div className="name" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {item.regulatoryWarehouseName}
                  </div>
                  <div className="name">剩余容量：{item.regulatoryWarehouseWeight}KG</div>
                  <div
                    className="name"
                    style={{ textAlign: 'left' }}
                    title={item.regulatoryWarehouseAdd}
                  >
                    {item.regulatoryWarehouseAdd}
                  </div>
                </div>
              </Col>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {props.isRegulatory ? '--暂无数据--' : '--所选时段内无可服务的监管仓--'}
          </div>
        )}
      </Row>
    </Modal>
  );
};

export default ReportModal;
