import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, message } from 'antd';
import adminApi from 'api/admin';
import systemApi from 'api/system.js';
import './index.less';

const AddAndUpdate = (props) => {
  const { visible, data, onCancel, getData, page, type } = props;
  const [typeList, setTypeList] = useState([]);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: { span: 22 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  useEffect(() => {
    getData(1, 10);
    form.setFieldsValue({ ...data });
    systemApi.getValue({ type: 'company_type' }).then((res) => {
      if (res?.data?.success) {
        setTypeList(res.data.data.dataList);
      }
    });
  }, [type]);
  const handleSubmit = () => {
    if (type == 'add') {
      form.validateFields().then((values) => {
        adminApi.addTemplate({ ...values }).then((res) => {
          if (res?.data?.success) {
            handleCancel();
            message.success('新增模板成功');
          } else {
            message.error(res.data.message);
          }
        });
      });
    } else {
      form.validateFields().then((values) => {
        adminApi.updateTemplate({ ...values, id: data.id }).then((res) => {
          if (res?.data?.success) {
            handleCancel();
            message.success('新增模板成功');
          } else {
            message.error(res.data.message);
          }
        });
      });
    }
  };
  const handleCancel = () => {
    onCancel();
    getData(page, 10);
    form.resetFields();
  };
  return (
    <Modal
      onCancel={handleCancel}
      onOk={handleSubmit}
      title={type == 'add' ? '新增企业模板' : '编辑企业模板'}
      visible={visible}
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item name={'templateName'} label="企业模板名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'description'} label="企业模板描述" rules={[{ required: true }]}>
          <Input.TextArea row={5} />
        </Form.Item>
        <Form.Item name={'companyType'} label="企业类型" rules={[{ required: true }]}>
          <Radio.Group>
            {typeList.map((ele, index) => {
              return (
                <Radio key={ele.id} value={ele.value}>
                  {ele.name}
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item name={'status'} label="企业模板状态" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={true}>启用</Radio>
            <Radio value={false}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <p style={{ color: 'red' }}>注意：当您选择禁用时，相应角色组的成员将无法操作相应页面。</p>
      </Form>
    </Modal>
  );
};
export default AddAndUpdate;
