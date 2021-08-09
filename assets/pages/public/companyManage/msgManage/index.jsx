import React, { useState, useEffect } from 'react';
import { Form, Button, Input, message, Radio, Cascader } from 'antd';
import NameLabel from 'components/NameLabel';
import adminApi from 'api/admin';
import systemApi from 'api/system.js';
import changeRegulatoryLabel from 'utils/changeRegulatoryLabel.js';
import './index.less';

const MsgManage = (props) => {
  const companyInfo = JSON.parse(sessionStorage.getItem('companyInfo'));
  const companyLink = sessionStorage.getItem('companyLink');
  const [selectRegulator, setSelectRegulator] = useState({});
  const [cityList, setCityList] = useState([]);
  const [regulatoryName, setRegulatoryName] = useState('');
  const [editStatus, setEditStatus] = useState(false);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 12
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      address: companyInfo.address,
      type: companyInfo.companyType,
      companyLink: companyInfo.companyLink || companyLink
    });
    setRegulatoryName(companyInfo.regulatoryName);
    if (cityList.length == 0) {
      systemApi.getRegulatory().then((res) => {
        if (res?.data?.success) {
          const data = [];
          data.push(res.data.data);
          changeRegulatoryLabel(data);
          setCityList(data);
        }
      });
    }
  }, []);
  const handleSaveCompanyLink = () => {
    form.validateFields().then((values) => {
      adminApi
        .updateCompany({
          companyLink: values.companyLink || '',
          address: values.address,
          companyType: values.type,
          regulatoryCode: selectRegulator.code,
          regulatoryName: selectRegulator.value
        })
        .then((res) => {
          if (res?.data?.success) {
            sessionStorage.setItem('companyLink', res.data.data.companyLink);
            message.success('保存成功');
          } else {
            message.error(res.data.message);
          }
        });
    });
  };
  const handleEdit = () => {
    setEditStatus(true);
  };
  const handleSave = () => {
    setEditStatus(false);
    setRegulatoryName(selectRegulator.regulatoryName);
  };

  const handleCancel = () => {
    setEditStatus(false);
  };

  const handleChangeRegulator = (e, selectRegulator) => {
    setSelectRegulator(selectRegulator[selectRegulator.length - 1]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <NameLabel name="基本信息" />
      <Form form={form} {...formItemLayout}>
        <Form.Item label="主体名称" name="name">
          <span>{companyInfo.companyName}</span>
        </Form.Item>
        <Form.Item label="统一社会信用代码或组织机构代码" name="credit">
          <span>{companyInfo.uniformCode}</span>
        </Form.Item>
        <Form.Item label="法定代表人">
          <span>{companyInfo.uniformName}</span>
        </Form.Item>
        <Form.Item label="所属地区" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="主体类型" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="主体地址" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="联系人" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="联系人电话" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
      <div className="linkDiv">
        <Form form={form} {...formItemLayout}>
          <Form.Item name="companyLink" label="企业公众号" rules={[{ required: true }]}>
            <Input.TextArea placeholder="仅支持添加微信公众号和支付宝生活号链接！" row={4} />
          </Form.Item>
        </Form>
        <span></span>
      </div>
      <Button style={{ marginLeft: '200px' }} type="primary" onClick={handleSaveCompanyLink}>
        保存
      </Button>
    </div>
  );
};
export default MsgManage;
