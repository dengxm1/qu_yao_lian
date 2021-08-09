import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Popconfirm, Radio } from 'antd';
import './index.less';

const LossModal = (props) => {
  const { visible, handleClose } = props;
  const [form] = Form.useForm();
  const addFormItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 12
    }
  };
  const handleSubmit = () => {
    handleClose();
  };
  return (
    <Modal visible={visible} title="自用/损耗" onCancel={handleClose} onOk={handleSubmit}>
      <Form form={form} {...addFormItemLayout}>
        <Form.Item label="商品名称">
          <span>{'添加剂1'}</span>
        </Form.Item>
        <Form.Item label="库存类型">
          <span>{'原料库存'}</span>
        </Form.Item>
        <Form.Item label="商品名称">
          <Radio.Group>
            <Radio value={1}>自用</Radio>
            <Radio value={2}>损耗</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default LossModal;
