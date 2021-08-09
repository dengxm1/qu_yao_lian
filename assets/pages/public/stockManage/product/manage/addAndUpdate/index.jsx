import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Form,
  Select,
  InputNumber,
  Input,
  Table,
  Divider,
  Modal,
  DatePicker
} from 'antd';
import NameLabel from 'components/NameLabel';
import './index.less';
const { RangePicker } = DatePicker;

const AddAndUpdate = (props) => {
  const { visible, handleCancel, type } = props;
  const [addVisible, setAddVisible] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const columns = [
    {
      title: '产品ID',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },

    {
      title: '物料名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },
    {
      title: '采购数量',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },
    {
      title: '规格',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },
    {
      title: '单位',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },
    {
      title: '原料供应商',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },
    {
      title: '生产日期',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },
    {
      title: '批次',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },
    {
      title: '购买日期',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%'
    },
    {
      title: '操作',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: '10%',
      render: (text, record) => {
        return (
          <div>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </div>
        );
      }
    }
  ];

  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 12
    }
  };
  const handleClose = () => {
    handleCancel();
  };

  const handleAddCreditModal = () => {
    setAddVisible(true);
  };

  const handleAddCancel = () => {
    setAddVisible(false);
    addForm.resetFields();
  };
  const handleAdd = () => {};

  return (
    <div className="modal">
      <Drawer
        className="addDrawer"
        title="新增原料进货登记"
        placement="right"
        closable={true}
        maskClosable={false}
        width={1000}
        onClose={handleCancel}
        visible={visible}
        footer={
          <div>
            <Button type="primary">确认并提交</Button>
            <Button onClick={handleClose}>关闭</Button>
          </div>
        }
      >
        <NameLabel name={'基本信息'} />
        <div className="modal-first">
          <Form className="modal-first-right" form={form} {...formItemLayout}>
            <Form.Item name="credit" label="入库类型" rules={[{ required: true }]}>
              <Select placeholder="请选择入库类型">
                <Select.Option></Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="" label={'交易日期'} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
          <Form className="modal-first-left" form={form} {...formItemLayout}>
            <Form.Item name="place" label="登记人" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="place" label="经办人" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </div>
        <NameLabel name="原料进货信息" />
        <div className="modal-second">
          <Table columns={columns} />
          <Button className="add-btn" type="dashed" onClick={handleAddCreditModal}>
            + 新增
          </Button>
        </div>
      </Drawer>
      <Modal title="新增原料进货" visible={addVisible} onCancel={handleAddCancel} onOk={handleAdd}>
        <Form form={addForm} {...formItemLayout}>
          <Form.Item label="物料名称">
            <Input />
          </Form.Item>
          <Form.Item label="采购数量" rules={[{ type: 'number', message: '请输入数字' }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="规格">
            <Input />
          </Form.Item>
          <Form.Item label="单位">
            <Input />
          </Form.Item>
          <Form.Item label="原料供应商">
            <Input />
          </Form.Item>
          <Form.Item label="生产日期">
            <DatePicker />
          </Form.Item>
          <Form.Item label="批次">
            <Input />
          </Form.Item>
          <Form.Item label="购买日期">
            <DatePicker />
          </Form.Item>
          <Form.Item label="备注">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default AddAndUpdate;
