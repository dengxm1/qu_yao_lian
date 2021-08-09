import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Radio, InputNumber, message, Popconfirm } from 'antd';
import inventoryApi from 'api/inventory.js';
import './index.less';

const DealModal = (props) => {
  const { visible, data, cancel, getData, dealData } = props;
  const [type, setType] = useState('自用');
  const [tip, setTip] = useState('说明：库存调整是指在当前的库存数量减去所填写的调整数量');
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 12
    }
  };

  const handleCancel = () => {
    cancel();
    form.resetFields();
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const params = {
        productDetailId: dealData.productDetailId,
        num: JSON.parse(values.num),
        type: values.type
      };
      inventoryApi.zslStockDeal(params).then((res) => {
        if (res?.data?.data) {
          form.resetFields();
          message.success('库存处理成功');
          getData(1);
          handleCancel();
        } else {
          message.error(res.data.msg);
        }
      });
    });
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
    if (e.target.value == 8) {
      setTip('说明：库存调整是指在当前的库存数量加上所填写的调整数量');
    } else {
      setTip('说明：库存调整是指在当前的库存数量减去所填写的调整数量');
    }
  };

  return (
    <Modal
      title="库存处理"
      maskClosable={false}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <div>
          <Popconfirm onConfirm={handleSubmit} title="确调整库存吗？">
            <Button type="primary">确认</Button>
          </Popconfirm>

          <Button onClick={handleCancel}>取消</Button>
        </div>
      }
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item label="成品名称">{data.productName}</Form.Item>
        <Form.Item label="库存类型">
          {dealData.stockInType == '-1'
            ? '流通入库'
            : dealData.stockInType == '0'
            ? '生产入库'
            : dealData.stockInType == 1
            ? '物料入库'
            : ''}
        </Form.Item>
        <Form.Item
          label="库存数量调整类型"
          name="type"
          rules={[{ required: true, message: '库存数量调整类型不能为空' }]}
        >
          <Radio.Group onChange={handleChangeType} value={type}>
            <Radio value={3}>自用</Radio>
            <Radio value={4}>损耗</Radio>
            <Radio value={8}>增加</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="调整数量"
          name="num"
          rules={[
            {
              required: true,
              message: '调整数量不能为空'
            }
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <p style={{ marginLeft: '50px', marginTop: '-20px', color: 'red' }}>{tip}</p>
        <Form.Item label="规格">
          {data.spec}/{data.unit}
        </Form.Item>
        {/* <Form.Item label="单位">{data.unit}</Form.Item> */}
      </Form>
    </Modal>
  );
};

export default DealModal;
