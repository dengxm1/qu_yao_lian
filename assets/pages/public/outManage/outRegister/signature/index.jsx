import React, { useState, useEffect } from 'react';
import { Modal, Steps, Popover, Button, message } from 'antd';
import SignatureApi from 'api/signature.js';
const { Step } = Steps;
import './index.less';
const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);
const Signature = (props) => {
  const { visible, data, onCancel, getData, detailData } = props;
  const handleCreate = () => {
    const params = {
      inorderid: data.id,
      checkoutCard: detailData.checkCertNo,
      checkoutMobile: detailData.checkPersonMobile,
      checkoutUser: detailData.checkPerson,
      checkoutUserId: detailData.checkPersonId,
      productDetailId: data.productDetailId,
      productId: data.productId,
      signCard: detailData.issueCertNo,
      signMobile: detailData.issuePersonMobile,
      signUser: detailData.issuePerson,
      signUserId: detailData.issuePersonId
    };
    SignatureApi.inspectionReport(params).then((res) => {
      if (res?.data?.success) {
        onCancel();
        getData();
      } else {
        message.error(res.data.msg || res.data.message);
      }
    });
  };

  return (
    <Modal visible={visible} onCancel={onCancel} title={'申请签章'} width={650} footer={null}>
      <Steps current={0} progressDot={customDot} style={{ marginBottom: '30px' }}>
        <Step title="提交申请" />
        <Step title="申请检验人签章" />
        <Step title="申请签发人签章" />
        <Step title="申请公章" />
        <Step title="完成" />
      </Steps>

      <Button
        type="primary"
        onClick={handleCreate}
        style={{ width: '128px', display: 'flex', justifyContent: 'center', margin: '0 auto' }}
      >
        一键申请签章
      </Button>
    </Modal>
  );
};

export default Signature;
